const express = require('express');
const router = express.Router();
const db = require('./db');
const fs = require('fs');
const path = require('path');

const authenticate = require('./middleware/authenticate');
const uploadPicture = require('./middleware/upload');

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
router.post('/', authenticate, uploadPicture, async (req, res, next) => {

  const { name, description, url, wishlists_id, idea_id } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token

  const quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : undefined;
  const price = req.body.price ? parseFloat(req.body.price) : undefined;


  if (!wishlists_id || !quantity) {
    deleteUploadedFile(req);
    return res.status(400).json({ message: "wishlists_id and quantity are required" });
  }

  if (!name && !idea_id) {
    deleteUploadedFile(req);
    return res.status(400).json({ message: "name or idea_id is required" });
  }


  // Type checking
  if (name !== undefined && typeof name !== "string") {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "name must be a string" });
  }
  if (description !== undefined && typeof description !== "string") {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "description must be a string" });
  }
  if (url !== undefined && typeof url !== "string") {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "url must be a string" });
  }
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "quantity must be a non-negative integer" });
  }
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "price must be a non-negative number" });
  }


  try {
    // Check if the user is a member of the given wishlist
    const member = await db.query(
      `SELECT id, owner FROM wishlist_members WHERE user_id = $1 AND wishlists_id = $2`,
      [userId, wishlists_id]);

    if (member.rows.length === 0) {
      deleteUploadedFile(req);
      return res.status(403).json({ error: "You are not a member of this wishlist" });
    }

    if (!member.rows[0].owner) {
      deleteUploadedFile(req);
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
    let ideaData = null;
    let image = null;

    // if the source idea is provided we want to copy 
    if (idea_id) {
      deleteUploadedFile(req);

      const ideaResult = await db.query(`
      SELECT name, description, url, image, price 
      FROM ideas 
      WHERE id = $1;
      `, [idea_id]);

      if (ideaResult.rows.length === 0) {
        return res.status(404).json({ error: "The provided idea_id does not exist" });
      }

      ideaData = ideaResult.rows[0];

      await db.query(`
      UPDATE ideas 
      SET uses = uses + 1 
      WHERE id = $1;
      `, [idea_id]);


      // insert the item
      const result = await db.query(`
      INSERT INTO items 
      (member_id, name, description, url, image, quantity, price, priority, dateCreated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *;
      `, [member_id, ideaData.name, ideaData.description, ideaData.url, ideaData.image, quantity, ideaData.price, priority]);

      res.status(201).json({ message: "Item created successfully", item: result.rows[0] });

    } else {
      // Determine image path 
      if (req.file) {
        image = `/uploads/items/${req.file.filename}`; // Use uploaded image path
      } else {
        image = "/assets/placeholder-item.png";
      }

      // insert the item
      const result = await db.query(`
      INSERT INTO items 
      (member_id, name, description, url, image, quantity, price, priority, dateCreated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *;
      `, [member_id, name, description, url, image, quantity, price, priority]);

      return res.status(201).json({ message: "Item created successfully", item: result.rows[0] });
    }

  } catch (error) {
    console.error("Error adding item:", error);
    deleteUploadedFile(req);
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
        const { id, name, description, url, quantity, price, priority } = item;


        // see if item exists, also get wishlist id
        const itemCheck = await db.query(
          `SELECT i.id, wm.wishlists_id 
          FROM items i 
          JOIN wishlist_members wm ON i.member_id = wm.id
          WHERE i.id = $1;`,
          [id]
        );

        if (itemCheck.rows.length === 0) {
          await db.query("ROLLBACK");
          return res.status(404).json({ error: "Item not found" });
        }

        const wishlist_id = itemCheck.rows[0].wishlists_id;

        // determine if user is an owner of the wishlist
        const ownershipCheck = await db.query(
          `SELECT owner 
          FROM wishlist_members wm
          WHERE wishlists_id = $1 AND user_id = $2`,
          [wishlist_id, userId]
        );

        if (ownershipCheck.rows.length === 0) {
          await db.query("ROLLBACK");
          return res.status(403).json({ error: "You are not a member of this wishlist" });
        }

        if (!ownershipCheck.rows[0].owner) {
          await db.query("ROLLBACK");
          return res.status(403).json({ error: `You do not have permission to edit item: ${id}` });
        }

        // Update the items with provided values (only update fields that are passed)
        const result = await db.query(`
              UPDATE items
              SET 
                  name = COALESCE($1, name),
                  description = COALESCE($2, description),
                  url = COALESCE($3, url),
                  quantity = COALESCE($4, quantity),
                  price = COALESCE($5, price),
                  priority = COALESCE($6, priority),
                  dateUpdated = NOW()
              WHERE id = $7
              RETURNING *;
            `, [name, description, url, quantity, price, priority, id]);
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
  const { name, description, url, quantity, price, priority } = req.body;

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

    // see if item exists, also get wishlist id
    const itemCheck = await db.query(
      `SELECT i.id, wm.wishlists_id 
      FROM items i 
      JOIN wishlist_members wm ON i.member_id = wm.id
      WHERE i.id = $1;`,
      [itemId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const wishlist_id = itemCheck.rows[0].wishlists_id;

    // determine if user is an owner of the wishlist
    const ownershipCheck = await db.query(
      `SELECT owner 
        FROM wishlist_members wm
        WHERE wishlists_id = $1 AND user_id = $2`,
      [wishlist_id, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You are not a member of this wishlist" });
    }

    if (!ownershipCheck.rows[0].owner) {
      return res.status(403).json({ error: "You do not have permission to edit this item" });
    }



    // Update the wishlist with provided values (only update fields that are passed)
    const result = await db.query(`
        UPDATE items
        SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            url = COALESCE($3, url),
            quantity = COALESCE($4, quantity),
            price = COALESCE($5, price),
            priority = COALESCE($6, priority),
            dateUpdated = NOW()
        WHERE id = $7
        RETURNING *;
      `, [name, description, url, quantity, price, priority, itemId]);

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
    // see if item exists, also get wishlist id
    const itemCheck = await db.query(
      `SELECT i.id, wm.wishlists_id 
      FROM items i 
      JOIN wishlist_members wm ON i.member_id = wm.id
      WHERE i.id = $1;`,
      [itemId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const wishlist_id = itemCheck.rows[0].wishlists_id;

    // determine if user is an owner of the wishlist
    const ownershipCheck = await db.query(
      `SELECT owner 
        FROM wishlist_members wm
        WHERE wishlists_id = $1 AND user_id = $2`,
      [wishlist_id, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You are not a member of this wishlist" });
    }

    if (!ownershipCheck.rows[0].owner) {
      return res.status(403).json({ error: "You do not have permission to delete this item" });
    }

    // Delete the old image off of server
    await deleteImage(itemId);

    // Delete the wishlist
    await db.query(`DELETE FROM items WHERE id = $1;`, [itemId]);

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



// localhost:3000/items/upload-profile
// upload new item picture
router.post('/upload/:itemId', authenticate, uploadPicture, async (req, res) => {

  const itemId = parseInt(req.params.itemId);
  const userId = req.user.userId; // Get user ID from authenticated token

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = `/uploads/items/${req.file.filename}`; // get file name from file

  try {
    // make sure owner has permission to do this
    const ownershipCheck = await db.query(
       `SELECT i.id, i.idea_id 
        FROM items i
        JOIN wishlist_members wm ON i.member_id = wm.id
        WHERE i.id = $1 AND wm.user_id = $2`,
      [itemId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      deleteUploadedFile(req);
      return res.status(403).json({ error: "You do not have permission to edit this item" });
    }

    if (ownershipCheck.rows[0].idea_id) {
      deleteUploadedFile(req);
      return res.status(403).json({ error: "Cannot change the image of a predefined idea item" });
    }


    // Delete the old image off of server
    await deleteImage(itemId);

    await db.query("UPDATE items SET image = $1 WHERE id = $2", [filePath, itemId]);
    res.json({ message: "item image updated!", imageUrl: `http://wishify.ca${filePath}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete the old profile picture off of server
async function deleteImage(itemId) {

  //get the file name
  const item = await db.query("SELECT image FROM items WHERE id = $1", [itemId]);

  const filePath = item.rows[0].image;
  
  // if the file is not null and is different that default, and is not an idea
  if (filePath && filePath !== "/assets/placeholder-item.png" && !filePath.includes("idea")) {
    const oldPicPath = path.join(__dirname, '.', filePath);
    if (fs.existsSync(oldPicPath)) {
      console.log("deleting this file: " + oldPicPath);
      fs.unlinkSync(oldPicPath);
    } else {
      console.log("Old picture file does not exist:", oldPicPath);
    }
  }
}


// Helper function to delete uploaded file if it exists
// used in case of an error
function deleteUploadedFile(req) {
  if (req.file) {
    const filePath = path.join(__dirname, './uploads/items', req.file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete uploaded file:", err);
      }
    });
    console.log("deleting this file: " + `./uploads/items${req.file.filename}`);
  }
}



module.exports = router;
