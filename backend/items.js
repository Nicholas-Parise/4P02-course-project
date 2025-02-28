const express = require('express');
const { parseArgs } = require('util');
const router = express.Router();
const db = require('./db');
const authenticate = require('./authenticate');


// localhost:3000/items/0
// get the contents of a single item
router.get('/:itemId', authenticate, async(req,res,next)=>{
    
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const itemId = parseInt(req.params.itemId);
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
  
    const result = await db.query(
          `SELECT * FROM items WHERE id = $1`,[itemId]);
  
  
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }
  
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/items
// create an item (given wishlists id)
router.post('/', authenticate, async(req,res,next)=>{

  const itemId = parseInt(req.params.itemId);
  const { name, description, url, image, quantity, price, wishlists_id } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token
  
  if (!wishlists_id || !name || !quantity) {
    return res.status(400).json({ message: "wishlists_id, name and quantity are required" });
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

      // insert the item
      const result = await db.query(`
        INSERT INTO items 
        (member_id, name, description, url, image, quantity, price, dateCreated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *;
      `, [member_id, name, description, url, image, quantity, price]);
  
      res.status(201).json({ message: "Item created successfully", item: result.rows[0] });
  
    } catch (error) {
      console.error("Error adding item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

});






// localhost:3000/items/0
// edit the contents of a single item
router.put('/:itemId', authenticate, async(req,res,next)=>{

  const itemId = parseInt(req.params.itemId);
  const { name, description, url, image, quantity, price } = req.body;
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
            dateUpdated = NOW()
        WHERE id = $7
        RETURNING *;
      `, [name, description, url, image, quantity, price, itemsId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "item not found." });
      }
  
      res.json({ message: "item updated successfully.", wishlist: result.rows[0] });
  
  
    } catch (error) {
      console.error("Error editing item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

});



// localhost:3000/items/0
// delete the contents of a single item
router.delete('/:itemId', authenticate, async(req,res,next)=>{

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

      res.json({ message: "Wishlist deleted successfully." });
    } catch (error) {
      console.error("Error editing item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

});




  module.exports = router;
