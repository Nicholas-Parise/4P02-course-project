const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./middleware/authenticate');
require('dotenv').config();

// localhost:3000/categories?page=1&pageSize=10
// get all the categories
router.get('/', async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {

    const result = await db.query(`SELECT * FROM categories`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "categories not found." });
    }

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// localhost:3000/categories/0
// get event details
router.get('/:categoryId', async (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);

  try {
    const result = await db.query(
      `SELECT * FROM categories
           WHERE id = $1`, [categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "category not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



// localhost:3000/categories
// create a category
router.post('/', authenticate, async (req, res, next) => {
  const userId = req.user.userId; // Get user ID from authenticated token
  const { name, description} = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "name and description are required fields" });
  }

  if(userId !== 1){
    return res.status(403).json({ message: "must be admin"});
  }

  try {
    const result = await db.query(`
        INSERT INTO categories
        (name, description, created)
        VALUES ($1, $2, NOW()) RETURNING *;`, [name, description]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "categories not found." });
    }

    res.status(201).json({ message: "category created successfully", category: result.rows[0] });
  } catch (error) {
     // Handle duplicate category error
     if (error.code === "23505") { 
      return res.status(409).json({ message: "Category already exists" });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
