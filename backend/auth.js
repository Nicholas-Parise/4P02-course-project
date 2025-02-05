const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require('./db');
require("dotenv").config();

let categoriesEntry = [
  {id:0, user_id:0, name:'things', description:'who doesnt like things', like: true},
  {id:1, user_id:0, name:'stuff', description:'who deosnt like stuff', like: true}
];


// localhost:3000/auth/register
// register account
router.post('/register',async (req,res,next)=>{
    const { email, password, displayName, picture } = req.body;

    if (!email || !password || !displayName) {
        return res.status(400).json({ message: "email, password and displayName are required" });
    }

    // I don't know how to do images rn so its always gonna be the placeholder
    const tempPicture = "/assets/placeholder-avatar.png";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            "INSERT INTO users (displayName, password, email, picture, dateCreated) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, displayName, email",
            [displayName, hashedPassword, email, tempPicture]
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
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

        const token = jwt.sign({ userId: user.rows[0].id, email: user.rows[0].email }, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });

        await db.query("INSERT INTO sessions (user_id, token, created) VALUES ($1, $2, NOW())", [user.rows[0].id, token]);

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
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
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out" });
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

        const user = await db.query("SELECT id, displayName, email, picture FROM users WHERE id = $1", [session.rows[0].user_id]);

        if (user.rows.length === 0) { // If a user gets removed but the token is still active 
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

});





  module.exports = router;
