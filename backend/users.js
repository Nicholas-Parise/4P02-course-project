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

    res.status(200).json({ user: result.rows[0], categories: result2.rows });
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
    const { email, displayName, picture, password, newPassword, bio, notifications } = req.body;
    let newhHashedPassword = null;

    // Type checking
    if (email !== undefined && typeof email !== "string") {
      return res.status(400).json({ error: "email must be a string" });
    }
    if (displayName !== undefined && typeof displayName !== "string") {
      return res.status(400).json({ error: "displayName must be a string" });
    }
    if (picture !== undefined && typeof picture !== "string") {
      return res.status(400).json({ error: "picture must be a string" });
    }
    if (password !== undefined && typeof password !== "string") {
      return res.status(400).json({ error: "password must be a string" });
    }
    if (newPassword !== undefined && typeof newPassword !== "string") {
      return res.status(400).json({ error: "newPassword must be a string" });
    }
    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ error: "bio must be a string" });
    }
    if (notifications !== undefined && typeof notifications !== "boolean") {
      return res.status(400).json({ error: "notifications must be a boolean" });
    }

    // if user sends a new password, make sure they supply their old password and it is correct.
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
              notifications = COALESCE($6, notifications),
              dateupdated = NOW()
          WHERE id = $7
          RETURNING id, email, displayName, picture, datecreated, dateupdated`, [displayName, picture, newhHashedPassword, email, bio, notifications, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: result.rows[0] });

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

    return res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting account" });
  }
});



// localhost:3000/users/0
// get specific user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await db.query('SELECT id, displayName, bio, picture, notifications, datecreated FROM users WHERE id = $1', [userId]);
    const result2 = await db.query(
      `SELECT c.*, uc.love FROM categories c
        JOIN user_categories uc ON c.id = uc.category_id
        WHERE uc.user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: result.rows[0], categories: result2.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// Assign a category from logged in user: post /categories/1234
// Assign multiple categories from logged in user: post /categories
router.post('/categories/:categoryId?', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  // MULTIPLE INSERT
  if (Array.isArray(req.body.categories)) {
    const categories = req.body.categories;
    try {
      await db.query("BEGIN"); // Start transaction

      const errors = [];

      for (const category of categories) {
        const { id, love } = category;

        if (!id || love === null || love === undefined) {
          errors.push({ id, message: "id and love are required fields" });
          continue;
        }

        if (love !== undefined && typeof love !== "boolean") {
          errors.push({ id, message: "love must be a boolean (true or false)" });
          continue;
        }

        try {
          await db.query(
            `INSERT INTO user_categories 
            (user_id, category_id, love, created)
            VALUES ($1, $2, COALESCE($3, false), NOW());`,
            [userId, id, love]
          );
        } catch (error) {
          if (error.code === "23505") {
            errors.push({ id, message: "Category is already added" });
          } else {
            errors.push({ id, message: "Database error" });
          }
        }
      }

      if (errors.length > 0) {
        await db.query("ROLLBACK");
        return res.status(400).json({ message: "Some categories could not be added", errors });
      }

      await db.query("COMMIT");
      return res.status(200).json({ message: "Categories assigned successfully" });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error adding categories:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

  }

  /// SINGLE INSERT
  try {
    const categoryId = parseInt(req.params.categoryId);
    const { love } = req.body;

    // Ensure love is not null
    if (love === null || love === undefined) {
      return res.status(400).json({ message: "love is a required field" });
    }

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

    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// remove a category from logged in user: delete /categories/1234
// remove multiple categories from logged in user: delete /categories
router.delete('/categories/:categoryId?', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  // MULTIPLE DELETE
  if (Array.isArray(req.body.categories)) {
    const categories = req.body.categories;
    try {
      await db.query("BEGIN"); // Start transaction

      const errors = [];

      for (const category of categories) {
        const { id } = category;

        if (!id) {
          errors.push({ id, message: "id are required fields" });
          continue;
        }

        try {

          await db.query(`
            DELETE FROM user_categories 
            WHERE user_id = $1 AND category_id = $2;`, [userId, id]);

        } catch (error) {
          errors.push({ id, message: "Database error" });
        }
      }

      if (errors.length > 0) {
        await db.query("ROLLBACK");
        return res.status(400).json({ message: "Some categories could not be removed", errors });
      }

      await db.query("COMMIT");
      return res.status(200).json({ message: "Categories removed successfully" });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error removing categories:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

  }

  /// SINGLE DELETE
  try {
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


// update a category from logged in user: PUT /categories/1234
// update multiple categories from logged in user: PUT /categories
router.put('/categories/:categoryId?', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  // MULTIPLE EDIT
  if (Array.isArray(req.body.categories)) {
    const categories = req.body.categories;
    try {
      await db.query("BEGIN"); // Start transaction

      const errors = [];

      for (const category of categories) {
        const { id, love } = category;

        if (!id || love === null || love === undefined) {
          errors.push({ id, message: "id and love are required fields" });
          continue;
        }

        if (love !== undefined && typeof love !== "boolean") {
          errors.push({ id, message: "love must be a boolean (true or false)" });
          continue;
        }

        try {
          await db.query(`
            UPDATE user_categories
            SET 
                love = COALESCE($1, love)
            WHERE user_id = $2 AND category_id = $3;
          `, [love, userId, id]);

        } catch (error) {
          errors.push({ id, message: "Database error" });
        }
      }

      if (errors.length > 0) {
        await db.query("ROLLBACK");
        return res.status(400).json({ message: "Some categories could not be edited", errors });
      }

      await db.query("COMMIT");
      return res.status(200).json({ message: "Categories editing successfully" });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error editing categories:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

  }

  /// SINGLE EDIT
  try {
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
