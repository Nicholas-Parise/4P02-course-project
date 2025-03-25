const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./middleware/authenticate');

// localhost:3000/items/0
// get the contents of a single item
router.get('/:itemId', authenticate, async (req, res, next) => {

  const itemId = parseInt(req.params.itemId);

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(
      `SELECT * FROM items WHERE id = $1`, [itemId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/items
// create an item (given wishlists id)
router.post('/', authenticate, async (req, res, next) => {

  const { name, description, url, image, quantity, price, wishlists_id } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token

  if (!wishlists_id || !name || !quantity) {
    return res.status(400).json({ message: "wishlists_id, name and quantity are required" });
  }

  // Type checking
  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ error: "name must be a string" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "description must be a string" });
  }
  if (url !== undefined && typeof url !== "string") {
    return res.status(400).json({ error: "url must be a string" });
  }
  if (image !== undefined && typeof image !== "string") {
    return res.status(400).json({ error: "image must be a string" });
  }
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return res.status(400).json({ error: "quantity must be a non-negative integer" });
  }
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return res.status(400).json({ error: "price must be a non-negative number" });
  }


  try {
    // Check if the user is a member of the given wishlist
    const member = await db.query(
      `SELECT id, owner FROM wishlist_members WHERE user_id = $1 AND wishlists_id = $2`,
      [userId, wishlists_id]);

    if (member.rows.length === 0) {
      return res.status(403).json({ error: "You are not a member of this wishlist" });
    }

    if (!member.rows[0].owner) {
      return res.status(403).json({ error: "You do not have permission to add items to this wishlist" });
    }

    const member_id = member.rows[0].id;


    // Get the current max priority for items in this wishlist
    const priorityResult = await db.query(
      `SELECT COALESCE(MAX(priority), 0) + 1 AS next_priority 
        FROM items 
        WHERE member_id IN (
        SELECT id FROM wishlist_members WHERE wishlists_id = $1
        );`,
      [wishlists_id]
    );

    // make this be the bottom of the list using the amount of items in a wishlist
    const priority = priorityResult.rows[0].next_priority;


    // set default image if one isn't supplied
    let tempPicture;
    if (!image) {
        tempPicture = "/assets/placeholder-item.png";
    } else {
        tempPicture = image;
    }


    // insert the item
    const result = await db.query(`
        INSERT INTO items 
        (member_id, name, description, url, image, quantity, price, priority, dateCreated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *;
      `, [member_id, name, description, url, image, quantity, price, priority]);

    res.status(201).json({ message: "Item created successfully", item: result.rows[0] });

  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// edit the contents of a single item: put /items/1234
// or edit multiple items at the same time: put /items
router.put('/:itemId?', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  // MULTIPLE EDIT

  if (Array.isArray(req.body.items)) {
    const items = req.body.items;

    // Type checking (all) just priority for now
    for (const item of items) {

      // Type checking
      if (item.name !== undefined && typeof item.name !== "string") {
        return res.status(400).json({ error: "name must be a string" });
      }
      if (item.description !== undefined && typeof item.description !== "string") {
        return res.status(400).json({ error: "description must be a string" });
      }
      if (item.url !== undefined && typeof item.url !== "string") {
        return res.status(400).json({ error: "url must be a string" });
      }
      if (item.image !== undefined && typeof item.image !== "string") {
        return res.status(400).json({ error: "image must be a string" });
      }
      if (item.quantity !== undefined && (!Number.isInteger(item.quantity) || item.quantity < 0)) {
        return res.status(400).json({ error: "quantity must be a non-negative integer" });
      }
      if (item.price !== undefined && (typeof item.price !== "number" || item.price < 0)) {
        return res.status(400).json({ error: "price must be a non-negative number" });
      }
      if (item.priority !== undefined && (!Number.isInteger(item.priority) || item.priority < 0)) {
        return res.status(400).json({ error: "priority must be a non-negative integer" });
      }

    }

    try {
      await db.query("BEGIN"); // Start a transaction we want to edit all the items at the same time or not do it at all.

      for (const item of items) {
        const { id, name, description, url, image, quantity, price, priority } = item;


        const ownershipCheck = await db.query(
          `SELECT i.id 
                FROM items i
                JOIN wishlist_members wm ON i.member_id = wm.id
                WHERE i.id = $1 AND wm.user_id = $2`,
          [id, userId]
        );

        if (ownershipCheck.rows.length === 0) {
          await db.query("ROLLBACK"); // Roll back the transaction if unauthorized
          return res.status(403).json({ error: `You do not have permission to edit item: ${id}` });
        }

        // Update the items with provided values (only update fields that are passed)
        const result = await db.query(`
              UPDATE items
              SET 
                  name = COALESCE($1, name),
                  description = COALESCE($2, description),
                  url = COALESCE($3, url),
                  image = COALESCE($4, image),
                  quantity = COALESCE($5, quantity),
                  price = COALESCE($6, price),
                  priority = COALESCE($7, priority),
                  dateUpdated = NOW()
              WHERE id = $8
              RETURNING *;
            `, [name, description, url, image, quantity, price, priority, id]);
      }

      await db.query("COMMIT"); // Commit all changes
      return res.status(201).json({ message: "Items updated successfully." });

    } catch (error) {
      await db.query("ROLLBACK"); // Roll back if any error occurs
      console.error("Error updating items:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }



  /// SINGLE EDIT
  const itemId = parseInt(req.params.itemId);
  const { name, description, url, image, quantity, price, priority } = req.body;

  // Type checking
  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ error: "name must be a string" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "description must be a string" });
  }
  if (url !== undefined && typeof url !== "string") {
    return res.status(400).json({ error: "url must be a string" });
  }
  if (image !== undefined && typeof image !== "string") {
    return res.status(400).json({ error: "image must be a string" });
  }
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return res.status(400).json({ error: "quantity must be a non-negative integer" });
  }
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return res.status(400).json({ error: "price must be a non-negative number" });
  }
  if (priority !== undefined && (!Number.isInteger(priority) || priority < 0)) {
    return res.status(400).json({ error: "priority must be a non-negative integer" });
  }


  try {
    const ownershipCheck = await db.query(
      `SELECT i.id 
        FROM items i
        JOIN wishlist_members wm ON i.member_id = wm.id
        WHERE i.id = $1 AND wm.user_id = $2`,
      [itemId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to edit this item" });
    }

    // Update the wishlist with provided values (only update fields that are passed)
    const result = await db.query(`
        UPDATE items
        SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            url = COALESCE($3, url),
            image = COALESCE($4, image),
            quantity = COALESCE($5, quantity),
            price = COALESCE($6, price),
            priority = COALESCE($7, priority),
            dateUpdated = NOW()
        WHERE id = $8
        RETURNING *;
      `, [name, description, url, image, quantity, price, priority, itemId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "item not found." });
    }

    res.status(201).json({ message: "item updated successfully.", item: result.rows[0] });


  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



// localhost:3000/items/0
// delete the contents of a single item
router.delete('/:itemId', authenticate, async (req, res, next) => {

  const itemId = parseInt(req.params.itemId);
  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const ownershipCheck = await db.query(
      `SELECT i.id 
        FROM items i
        JOIN wishlist_members wm ON i.member_id = wm.id
        WHERE i.id = $1 AND wm.user_id = $2`,
      [itemId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to edit this item" });
    }

    // Delete the wishlist
    await db.query(`DELETE FROM items WHERE id = $1;`, [itemId]);

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});




module.exports = router;
