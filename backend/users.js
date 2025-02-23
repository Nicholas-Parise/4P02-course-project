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
      const result = await db.query('SELECT id, email, displayName, picture, datecreated, dateupdated FROM users WHERE id = $1', [userId]);

      console.log(userId);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(result.rows[0]);
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
      const { email, displayName, picture, password, newPassword } = req.body;

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
              email =  COALESCE($4, email),
              dateupdated = NOW()
          WHERE id = $5
          RETURNING id, email, displayName, picture, datecreated, dateupdated`, [displayName, picture, newhHashedPassword, email, userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile updated", user: result.rows[0] });

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

      res.json({ message: "Account deleted successfully" });

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
      const result = await db.query('SELECT id, displayName, picture, datecreated FROM users WHERE id = $1', [userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: 'Error retrieving user data' });
  }
});

  module.exports = router;