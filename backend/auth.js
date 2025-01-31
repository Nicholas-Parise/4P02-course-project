const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

let categoriesEntry = [
  {id:0, user_id:0, name:'things', description:'who doesnt like things', like: true},
  {id:1, user_id:0, name:'stuff', description:'who deosnt like stuff', like: true}
];


// localhost:3000/auth/register
// register account
router.post('/register',async (req,res,next)=>{
    
})

// localhost:3000/auth/login
// log in user and return token
router.post('/login', async (req, res, next) => {
   
    const SECRET_KEY = "verysecretkey"; // move to .env file
    const token = jwt.sign({ userId: 0, username: admin }, SECRET_KEY, {
        expiresIn: "24h",
    });
    
    res.json({ message: "Login successful", token });
});


// localhost:3000/auth/logout
// log user out and invalidate token
router.post('/logout', async (req, res, next) => {
   
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
});


// localhost:3000/auth/logout
// get user info 
router.get('/me', async (req, res, next) => {
   
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }


});





  module.exports = router;
