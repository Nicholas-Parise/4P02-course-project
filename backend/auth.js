const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require('./db');
require("dotenv").config();

// localhost:3000/auth/register
// register account
router.post('/register', async (req, res, next) => {
    const { email, password, displayName, picture, bio } = req.body;

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
    if (picture !== undefined && typeof picture !== "string") {
        return res.status(400).json({ error: "picture must be a string" });
    }
    if (bio !== undefined && typeof bio !== "string") {
        return res.status(400).json({ error: "bio must be a string" });
    }

    // I don't know how to do images rn so its always gonna be the placeholder
    let tempPicture;
    if (!picture) {
        tempPicture = "/assets/placeholder-avatar.png";
    } else {
        tempPicture = picture;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            "INSERT INTO users (displayName, password, email, picture, bio, notifications, dateCreated) VALUES ($1, $2, $3, $4, $5, true, NOW()) RETURNING id, displayName, email",
            [displayName, hashedPassword, email, tempPicture, bio]
        );

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
            { userId: user.rows[0].id, email: user.rows[0].email },
            process.env.SECRET_KEY,
            { expiresIn: "24h" });

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

        const user = await db.query("SELECT id, displayName, email, picture, bio FROM users WHERE id = $1", [session.rows[0].user_id]);

        if (user.rows.length === 0) { // If a user gets removed but the token is still active 
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

});


module.exports = router;
