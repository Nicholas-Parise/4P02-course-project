const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const db = require('./db');
const passport = require('passport');
const createNotification = require("./middleware/createNotification");
const sendEmail = require("./middleware/sendEmail");
require('./middleware/oauth');
require("dotenv").config();

// localhost:3000/auth/register
// register account
router.post('/register', async (req, res, next) => {
    const { email, password, displayName, bio, notifications } = req.body;

    if (!email || !password || !displayName) {
        return res.status(400).json({ message: "email, password and displayName are required" });
    }

    // Type checking
    if (email !== undefined && typeof email !== "string") {
        return res.status(400).json({ error: "email must be a string" });
    }
    if (password !== undefined && typeof password !== "string") {
        return res.status(400).json({ error: "password must be a string" });
    }
    if (displayName !== undefined && typeof displayName !== "string") {
        return res.status(400).json({ error: "displayName must be a string" });
    }

    if (bio !== undefined && typeof bio !== "string") {
        return res.status(400).json({ error: "bio must be a string" });
    }

    // default picture
    const picture = "/assets/placeholder-avatar.png";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (displayName, password, email, picture, bio, notifications, pro, setup, dateCreated) 
            VALUES ($1, $2, $3, $4, $5, COALESCE($6, true), false, true, NOW()) RETURNING id, displayName, email, notifications`,
            [displayName, hashedPassword, email, picture, bio, notifications]
        );

        // send notification if allowed 
        if (result.rows[0].notifications) {
            await createNotification([result.rows[0].id], "Welcome to Wishify!", "Hello from the wishify team! we are so excited to welcome you to this platform.", "/home");
            await welcomeEmail(email, displayName);
        }

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);

        // Handle duplicate email error
        // error code 23505 means unique constraint violated.
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email is already in use" });
        }

        res.status(500).json({ message: "Error registering user" });
    }

})

// localhost:3000/auth/login
// log in user and return token
router.post('/login', async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
    }

    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, email: user.rows[0].email, displayName: user.rows[0].displayname },
            process.env.SECRET_KEY,
            { expiresIn: "7d" });

        await db.query("INSERT INTO sessions (user_id, token, created) VALUES ($1, $2, NOW())", [user.rows[0].id, token]);

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in" });
    }
});


// localhost:3000/auth/logout
// log user out and invalidate token
router.post('/logout', async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        await db.query("DELETE FROM sessions WHERE token = $1", [token]);
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging out" });
    }
});


// localhost:3000/auth/me
// get user info 
router.get('/me', async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const session = await db.query("SELECT user_id FROM sessions WHERE token = $1", [token]);

        if (session.rows.length === 0) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await db.query("SELECT id, displayName, email, picture, bio, setup, (google_id IS NOT NULL) AS oauth FROM users WHERE id = $1", [session.rows[0].user_id]);

        if (user.rows.length === 0) { // If a user gets removed but the token is still active 
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

});


// helper function to generate a gaurnetted unique one time code
// since it's hex there is no 'o' only 'zero' 0->9 + A->F
// example code: 1F5A7B
const generateUniqueToken = async () => {
    let token;
    let exists = true;

    while (exists) {
        token = crypto.randomBytes(3).toString("hex"); // generate 6-character hex token
        const tokenCheck = await db.query("SELECT 1 FROM sessions WHERE token = $1", [token]);
        exists = tokenCheck.rows.length > 0; // If a row exists, try again
    }

    return token;
};


// localhost:3000/auth/forgot-password
// start the account recovery process, 
// send an email with recovery code to provided email if there is an account linked to it.
router.post('/forgot-password', async (req, res, next) => {

    const { email } = req.body;

    if (!email) {
        return res.status(401).json({ message: "email required" });
    }

    try {
        // Check if user exists
        const userCheck = await db.query("SELECT id, displayName, google_id FROM users WHERE email = $1", [email]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "No account with that email exists." });
        }

        if (userCheck.rows[0].google_id) {
        //    return res.status(404).json({ message: "Oauth users cannot change their password." });
        }

        const userId = userCheck.rows[0].id;
        const user_displayName = userCheck.rows[0].displayname;
        const resetToken = await generateUniqueToken(); // need to ensure a unique token, don't want a crash

        await db.query("BEGIN"); // Start a transaction

        await db.query("INSERT INTO sessions (user_id, token, created) VALUES ($1, $2, NOW())", [userId, resetToken]);

        const resetLink = `https://www.wishify.ca/forgot?token=${resetToken}`;

        await forgotEmail(email,user_displayName,resetLink,resetToken,1);

        await db.query("COMMIT"); // Commit the transaction
        
        return res.status(200).json({ message: "email sent successfully" });
    } catch (error) {
        await db.query("ROLLBACK"); // if we can't send an email we want to Rollback
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});



// localhost:3000/auth/reset-password
// given one time code, email and password reset password
router.post("/reset-password", async (req, res) => {
    const { email, otc, newPassword } = req.body;

    if (!email || !otc || !newPassword) {
        return res.status(401).json({ message: "email, otc and newPassword required" });
    }

    try {
        // Fetch session with token
        const tokenQuery = await db.query(
            `SELECT user_id, created FROM sessions WHERE token = $1`, [otc]
        );

        if (tokenQuery.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        const { user_id, created } = tokenQuery.rows[0];

        // Verify that the email matches the user_id
        const emailCheck = await db.query(
            `SELECT id FROM users WHERE id = $1 AND email = $2`,
            [user_id, email]
        );

        if (emailCheck.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or token." });
        }

        // Check if token is expired (1 hour limit)
        const expiryTime = 3600000; // 1 hour in milliseconds
        if (Date.now() - new Date(created).getTime() > expiryTime) {
            return res.status(400).json({ error: "Token has expired." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user_id]);

        // Delete used reset token
        await db.query("DELETE FROM sessions WHERE token = $1", [otc]);

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// Route to start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Callback route Google redirects to after auth, returns token
router.get('/google/callback', passport.authenticate('google', { session: false }), async(req, res) => {
  const user = req.user;


  const token = jwt.sign(
    { userId: user.id, email: user.email, displayName: user.displayname },
    process.env.SECRET_KEY,
    { expiresIn: "7d" });

    await db.query("INSERT INTO sessions (user_id, token, created) VALUES ($1, $2, NOW())", [user.id, token]);

//    res.status(200).json({ message: "oauth successful", token });
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
});


async function forgotEmail(to, first_name, reset_link, resetToken, expiry_time){

    let htmlTemplate = await fs.readFile(path.join(__dirname, './emailtemplates/ForgetPassword.html'), 'utf8');

    htmlTemplate = htmlTemplate
    .replace(/{{first_name}}/g, first_name)
    .replace(/{{reset_link}}/g, reset_link)
    .replace(/{{reset_token}}/g, resetToken)
    .replace(/{{expiry_time}}/g, expiry_time)
    .replace(/{{current_year}}/g, new Date().getFullYear());    

    await sendEmail(to,"Password Reset Request",null,htmlTemplate);
}


async function welcomeEmail(to, first_name){

    let htmlTemplate = await fs.readFile(path.join(__dirname, './emailtemplates/CreateAccount.html'), 'utf8');

    htmlTemplate = htmlTemplate
    .replace(/{{first_name}}/g, first_name)
    .replace(/{{email}}/g, to)
    .replace(/{{creation_date}}/g, new Date().toISOString().split('T')[0])
    .replace(/{{current_year}}/g, new Date().getFullYear());    

    await sendEmail(to,"Welcome to Wishify!",null,htmlTemplate);
}



module.exports = router;