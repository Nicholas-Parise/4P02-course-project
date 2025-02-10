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
  const itemsId = parseInt(req.params.itemId);
  
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


// localhost:3000/items/0
// edit the contents of a single item
router.put('/:itemId', authenticate, async(req,res,next)=>{

  const itemsId = parseInt(req.params.itemId);
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

  const itemsId = parseInt(req.params.itemId);
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
      await db.query(`DELETE FROM items WHERE id = $1;`, [itemsId]);

      res.json({ message: "Wishlist deleted successfully." });
    } catch (error) {
      console.error("Error editing item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

});




  module.exports = router;