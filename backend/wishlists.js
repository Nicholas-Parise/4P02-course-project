const express = require('express');
const router = express.Router();
const { parseArgs } = require('util');
const db = require('./db');
const authenticate = require('./authenticate');

let wishlistEntry = [
  {id:0, event_id:0, user_id:0, name:'nicks list', description:'video game console', image:'public/placeholder-wishlist.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'},
  {id:1, event_id:0, user_id:0, name:'lists list', description:'video game console', image:'public/placeholder-wishlist.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'}
];


// localhost:3000/wishlists?page=1&pageSize=10
// get list of wishlists from a member or is in an event 
router.get('/', authenticate, async(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    try {
      const userId = req.user.userId; // Get user ID from authenticated token

      const result = await db.query(`
          SELECT w.id, w.name, w.description, w.image, w.dateUpdated, w.dateCreated
          FROM wishlists w
          JOIN wishlist_members m ON w.id = m.wishlists_id
          WHERE m.user_id = $1;`, [userId]);

      res.json(result.rows);
  } catch (error) {
      console.error("Error fetching wishlists:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }

});


  /**
   * localhost:3000/wishlists
   * Create a wishlist, with or without an event
   * A user must be authenticated or it will cause an error
   */
  router.post('/', authenticate, async (req, res, next) => {

    try{
      const user_id = req.user.userId; // Get user ID from authenticated request

      const { event_id, name, description, image } = req.body;

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      await db.query("BEGIN"); // Start a transaction since we want to go all or nothing

      // Step 1: Insert wishlist
      const wishlistResult = await db.query(
          `INSERT INTO wishlists (event_id, name, description, image, dateCreated, dateUpdated) 
          VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
          [event_id, name, description, image]
      );

      const wishlist_id = wishlistResult.rows[0].id;

      // Step 2: Add the users membership (owner)
      await db.query(
          `INSERT INTO wishlist_members (user_id, wishlists_id, blind, owner, dateCreated, dateUpdated)
          VALUES ($1, $2, FALSE, TRUE, NOW(), NOW())`,
          [user_id, wishlist_id]
      );

      await db.query("COMMIT"); // Commit the transaction
      
      res.status(201).json({ wishlist_id, message: "Wishlist created successfully!" });
    
    }catch (error) {
      await db.query("ROLLBACK"); // Rollback if an error occurs
      res.status(500).json({ error: error.message });
    }

  });




// localhost:3000/wishlists/0
// get the contents of a single wishlist
router.get('/:wishlistId', authenticate, async(req,res,next)=>{
    
  const wishlistId = parseInt(req.params.wishlistId);
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(`
        SELECT w.id, w.name, w.description, w.image, w.dateUpdated, w.dateCreated, w.event_id
        FROM wishlists w
        JOIN wishlist_members m ON w.id = m.wishlists_id
        WHERE m.user_id = $1 AND w.id = $2;`, [userId,wishlistId]);


        if (result.rows.length === 0) {
          return res.status(404).json({ error: "wishlist not found." });
        }


    res.json(result.rows[0]);
} catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
}

});


// localhost:3000/wishlists/0
// delete a wishlist, but only if user is a member and is the owner.
router.delete('/:wishlistId', authenticate, async(req,res,next)=>{
    
  const wishlistId = parseInt(req.params.wishlistId);
  const userId = req.user.userId; // Get user ID from the authenticated token

  // make sure user is the owner of the wishlist before allowing deletion
  try {
    const ownershipCheck = await db.query(`
      SELECT m.owner
      FROM wishlist_members m
      WHERE m.user_id = $1 AND m.wishlists_id = $2;
      `, [userId, wishlistId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied. You are not a member of this wishlist." });
    }

    if (!ownershipCheck.rows[0].owner) {
      return res.status(403).json({ error: "Only the owner can delete this wishlist." });
    }

    // Delete the wishlist
    await db.query(`DELETE FROM wishlists WHERE id = $1;`, [wishlistId]);

    res.json({ message: "Wishlist deleted successfully." });
  } catch (error) {
    console.error("Error deleting  wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/wishlists/0
// edit a wishlist, but only if user is a member and is the owner.
router.put('/:wishlistId', authenticate, async(req,res,next)=>{
    
  const wishlistId = parseInt(req.params.wishlistId);
  const userId = req.user.userId; // Get user ID from the authenticated token
  const { event_id, name, description, image } = req.body;


  // make sure user is the owner of the wishlist before allowing editing
  try {
    const ownershipCheck = await db.query(`
      SELECT m.owner
      FROM wishlist_members m
      WHERE m.user_id = $1 AND m.wishlists_id = $2;
      `, [userId, wishlistId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied. You are not a member of this wishlist." });
    }

    if (!ownershipCheck.rows[0].owner) {
      return res.status(403).json({ error: "Only the owner can edit this wishlist." });
    }

    // Update the wishlist with provided values (only update fields that are passed)
    const result = await db.query(`
      UPDATE wishlists
      SET 
          event_id = COALESCE($1, event_id),
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          image = COALESCE($4, image),
          dateUpdated = NOW()
      WHERE id = $5
      RETURNING *;
    `, [event_id, name, description, image, wishlistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    res.json({ message: "Wishlist updated successfully.", wishlist: result.rows[0] });


  } catch (error) {
    console.error("Error editing wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});





  module.exports = router;