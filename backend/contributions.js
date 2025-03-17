const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./authenticate');


// localhost:3000/contributions/
// get all contributions from logged in user
router.get('/', authenticate, async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(
      `SELECT c.id, c.item_id, c.quantity, c.purchased, c.note, c.dateUpdated, c.dateCreated 
           FROM contributions c 
           JOIN wishlist_members wm ON c.member_id = wm.id
           WHERE wm.user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "contributions not found." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/contributions/wishlists/:id
// get all contributions from wishlist
router.get('/wishlists/:id', authenticate, async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const wishlistId = parseInt(req.params.id);

  try {

    const result = await db.query(
      `SELECT c.id, c.item_id, c.quantity, c.purchased, c.note, c.dateUpdated, c.dateCreated, u.displayName AS user_displayName, u.id AS user_id
        FROM contributions c
        JOIN wishlist_members wm ON c.member_id = wm.id
        JOIN users u ON wm.user_id = u.id
        WHERE wm.wishlists_id = $1;`,
      [wishlistId]
    );



    if (result.rows.length === 0) {
      return res.status(404).json({ error: "no contributions found." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/contributions/items/0
// get contributions from of a single item
router.get('/items/:id', authenticate, async (req, res, next) => {

  const itemId = parseInt(req.params.id);

  try {
    //const result = await db.query(`SELECT c.id, c.item_id, c.quantity, c.purchased, c.note, c.dateUpdated, c.dateCreated FROM contributions WHERE item_id = $1`,[itemId]);

    const result = await db.query(
      `SELECT c.id, c.item_id, c.quantity, c.purchased, c.note, c.dateUpdated, c.dateCreated, u.displayName AS user_displayName, u.id AS user_id
              FROM contributions c
              JOIN wishlist_members wm ON c.member_id = wm.id
              JOIN users u ON wm.user_id = u.id
              WHERE c.item_id = $1;`,
      [itemId]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "contributions not found." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// localhost:3000/contributions
// create a contribution for an item
router.post('/', authenticate, async (req, res, next) => {

  const { item_id, quantity, purchased, note } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token

  if (!item_id || !quantity) {
    return res.status(400).json({ message: "item_id and quantity are required" });
  }

  // Type checking
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return res.status(400).json({ error: "quantity must be a non-negative integer" });
  }
  if (purchased !== undefined && typeof purchased !== "boolean") {
    return res.status(400).json({ error: "purchased must be a boolean (true or false)" });
  }
  if (note !== undefined && typeof note !== "string") {
    return res.status(400).json({ error: "note must be a string" });
  }


  try {
    // get user membership from item id
    const wishlistResult = await db.query(
      `SELECT wm.wishlists_id FROM wishlist_members wm
        JOIN items i ON wm.id = i.member_id
        WHERE i.id = $1;`,
      [item_id]);

    const wishlistId = wishlistResult.rows[0].wishlists_id;

    const member = await db.query(
      `SELECT id FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2;`,
      [wishlistId, userId]);


    if (member.rows.length === 0) {
      return res.status(403).json({ error: "You are not a member of this wishlist" });
    }

    const member_id = member.rows[0].id;

    // insert the contribution
    const result = await db.query(`
        INSERT INTO contributions 
        (item_id, member_id, quantity, purchased, note, dateCreated)
        VALUES ($1, $2, $3, COALESCE($4, false), $5, NOW()) RETURNING *;
      `, [item_id, member_id, quantity, purchased, note]);

    res.status(201).json({ message: "contribution created successfully", contribution: result.rows[0] });

  } catch (error) {

    // Handle duplicate contribution error
    if (error.code === "23505") {
      return res.status(409).json({ message: "a contribution already exists for this item" });
    }

    console.error("Error adding item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});




// localhost:3000/contributions/0
// edit the contents of a single item
router.put('/:id', authenticate, async (req, res, next) => {

  const contributionId = parseInt(req.params.id);
  const { quantity, purchased, note } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token

  // Type checking
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return res.status(400).json({ error: "quantity must be a non-negative integer" });
  }
  if (purchased !== undefined && typeof purchased !== "boolean") {
    return res.status(400).json({ error: "purchased must be a boolean (true or false)" });
  }
  if (note !== undefined && typeof note !== "string") {
    return res.status(400).json({ error: "note must be a string" });
  }

  try {
    /// make sure that only the user that created the contribution can edit it.
    const ownershipCheck = await db.query(
      `SELECT c.id 
        FROM contributions c
        JOIN wishlist_members wm ON c.member_id = wm.id
        WHERE c.id = $1 AND wm.user_id = $2`,
      [contributionId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to edit this contribution" });
    }

    // Update the contribution with provided values (only update fields that are passed)
    const result = await db.query(`
        UPDATE contributions
        SET 
            quantity = COALESCE($1, quantity),
            purchased = COALESCE($2, purchased),
            note = COALESCE($3, note),
            dateUpdated = NOW()
        WHERE id = $4
        RETURNING *;
      `, [quantity, purchased, note, contributionId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "contribution not found." });
    }

    res.json({ message: "contribution updated successfully.", contribution: result.rows[0] });


  } catch (error) {
    console.error("Error editing contribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



// localhost:3000/items/0
// delete the contents of a single item
router.delete('/:id', authenticate, async (req, res, next) => {

  const contributionId = parseInt(req.params.id);
  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    /// make sure that only the user that created the contribution can edit it.
    const ownershipCheck = await db.query(
      `SELECT c.id 
        FROM contributions c
        JOIN wishlist_members wm ON c.member_id = wm.id
        WHERE c.id = $1 AND wm.user_id = $2`,
      [contributionId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to delete this contribution" });
    }

    // Delete the contribution
    await db.query(`DELETE FROM contributions WHERE id = $1;`, [contributionId]);

    res.json({ message: "Contribution deleted successfully." });
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});




module.exports = router;
