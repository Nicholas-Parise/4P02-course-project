const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const googleId = profile.id;
            const name = profile.displayName;

            // Check if user exists, depending on their 
            let result = await db.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [googleId, email]);

            let user;
            if (result.rows.length > 0) {
                user = result.rows[0];
                // if Google ID changes update it
                if (!user.google_id) {
                    await db.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
                }
            } else {
                // Create user
               /*
                const insertResult = await db.query(
                    'INSERT INTO users (email, displayName, google_id) VALUES ($1, $2, $3) RETURNING *',
                    [email, name, googleId]
                );
                */

                const picture = "/assets/placeholder-avatar.png";
                const password = "Oauth-User";

                const result = await db.query(
                    `INSERT INTO users (email, password, displayName, google_id, picture, notifications, pro, dateCreated) 
                    VALUES ($1, $2, $3, $4, $5, true, false, NOW()) RETURNING id, displayName, email, notifications`,
                    [email, password, name, googleId, picture]);

                user = result.rows[0];
            }

            done(null, user);
        } catch (err) {
            done(err);
        }
    }));
