const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require("bcryptjs");
const authenticate = require('./authenticate');

// localhost:3000/users
// get logged in users
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const result = await db.query('SELECT id, email, displayName, bio, picture, datecreated, dateupdated FROM users WHERE id = $1', [userId]);
    const result2 = await db.query(
       `SELECT c.*, uc.love FROM categories c
        JOIN user_categories uc ON c.id = uc.category_id
        WHERE uc.user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({user: result.rows[0], categories: result2.rows});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});

// localhost:3000/users
// Update logged-in user's profile
router.put('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const { email, displayName, picture, password, newPassword, bio} = req.body;

    let newhHashedPassword = null;

    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }

      // Get the user's stored hashed password
      const userResult = await db.query("SELECT password FROM users WHERE id = $1", [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "user not found" });
      }

      const hashedPassword = userResult.rows[0].password;

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        return res.status(403).json({ message: "Incorrect password" });
      }

      newhHashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const result = await db.query(`
          UPDATE users 
          SET 
              displayName = COALESCE($1, displayName), 
              picture = COALESCE($2, picture), 
              password = COALESCE($3, password),
              email = COALESCE($4, email),
              bio = COALESCE($5, bio),
              dateupdated = NOW()
          WHERE id = $6
          RETURNING id, email, displayName, picture, datecreated, dateupdated`, [displayName, picture, newhHashedPassword, email, bio, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ message: "Profile updated", user: result.rows[0] });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});


// localhost:3000/users
// Delete logged-in user's account
router.delete('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    // Get the user's stored hashed password
    const userResult = await db.query("SELECT password FROM users WHERE id = $1", [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }

    const hashedPassword = userResult.rows[0].password;

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    // Delete user if password is correct
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
});



// localhost:3000/users/0
// get specific user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await db.query('SELECT id, displayName, bio, picture, datecreated FROM users WHERE id = $1', [userId]);
    const result2 = await db.query(
      `SELECT c.*, uc.love FROM categories c
        JOIN user_categories uc ON c.id = uc.category_id
        WHERE uc.user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({user: result.rows[0], categories: result2.rows});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// localhost:3000/categories?page=1&pageSize=10
// Assign a category from logged in user
router.post('/categories/:categoryId', authenticate, async (req, res, next) => {
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const categoryId = parseInt(req.params.categoryId);
    const { love } = req.body;
    
    const result = await db.query(`
        INSERT INTO user_categories 
        (user_id, category_id, love, created)
        VALUES ($1, $2, COALESCE($3, false), NOW()) RETURNING id;`, [userId, categoryId, love]);
        
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "categories not found." });
    }

    res.status(200).json("success");

  } catch (error) {
    // Handle duplicate category error
    if (error.code === "23505") { 
      return res.status(409).json({ message: "Category is already added" });
    }

    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/categories?page=1&pageSize=10
// remove a category from logged in user
router.delete('/categories/:categoryId', authenticate, async (req, res, next) => {
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const categoryId = parseInt(req.params.categoryId);
    // remove the category
    const result = await db.query(`
        DELETE FROM user_categories 
        WHERE user_id = $1 AND category_id = $2;`, [userId, categoryId]);

    res.status(200).json({ message: "category removed successfully." });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// localhost:3000/categories?page=1&pageSize=10
// update a category from logged in user
router.put('/categories/:categoryId', authenticate, async (req, res, next) => {
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const categoryId = parseInt(req.params.categoryId);
    const { love } = req.body;
      
    // Ensure love is not null
    if (love === null || love === undefined) { 
      return res.status(400).json({ message: "love is a required field" }); 
    }

    const result = await db.query(`
        UPDATE user_categories
        SET 
            love = COALESCE($1, love)
        WHERE user_id = $2 AND category_id = $3
        RETURNING *;
      `, [love, userId, categoryId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "categories not found." });
    }

    res.status(200).json("success");

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;