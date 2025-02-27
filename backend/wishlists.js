const express = require('express');
const router = express.Router();
const { parseArgs } = require('util');
const db = require('./db');
const authenticate = require('./authenticate');


// localhost:3000/wishlists?page=1&pageSize=10
// get list of wishlists from a member or is in an event 
router.get('/', authenticate, async(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    try {
      const userId = req.user.userId; // Get user ID from authenticated token

      const result = await db.query(`
          SELECT w.*
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

      const { event_id, name, description, image, deadline } = req.body;

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      await db.query("BEGIN"); // Start a transaction since we want to go all or nothing

      // Step 1: Insert wishlist
      const wishlistResult = await db.query(
          `INSERT INTO wishlists (event_id, name, description, image, deadline, dateCreated, dateUpdated) 
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`,
          [event_id, name, description, image, deadline]
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
        SELECT w.*
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
  const { event_id, name, description, image, deadline } = req.body;


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
          deadline = COALESCE($5, deadline),
          dateUpdated = NOW()
      WHERE id = $6
      RETURNING *;
    `, [event_id, name, description, image, deadline, wishlistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    res.json({ message: "Wishlist updated successfully.", wishlist: result.rows[0] });


  } catch (error) {
    console.error("Error editing wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/wishlists/:id/members
// get list of members under a wishlist
router.get('/:wishlistId/members', authenticate, async (req, res) => {
  const wishlistId = parseInt(req.params.wishlistId);

  try {
      const result = await db.query(`
          SELECT u.id, u.displayName, u.email, u.picture
          FROM users u
          JOIN wishlist_members wm ON u.id = wm.user_id
          WHERE wm.wishlists_id = $1;
      `, [wishlistId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "No members found for this wishlist" });
      }

      res.json({ members: result.rows });
  } catch (error) {
      console.error("Error fetching members for wishlist:", error);
      res.status(500).json({ message: "Error fetching members" });
  }
});



// localhost:3000/wishlists/:id/members?page=1&pageSize=10
// add a member to an wishlist
router.post('/:id/members', authenticate, async (req, res) => {
  const wishlistId = parseInt(req.params.id);
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { userId, blind, owner } = req.body;  // the user provides the userId of the member to add
  
  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      // make sure user is the owner of the wishlist before allowing editing of others memberships
      const ownershipCheck = await db.query(`
        SELECT m.owner
        FROM wishlist_members m
        WHERE m.user_id = $1 AND m.wishlists_id = $2;
        `, [authUserId, wishlistId]);

      if (ownershipCheck.rows.length === 0) {
        return res.status(403).json({ error: "Access denied. You are not a member of this wishlist." });
      }

      if (!ownershipCheck.rows[0].owner) {
        return res.status(403).json({ error: "Only the owner can add a member to this wishlist ." });
      }


      // Check if the user is already a member of the wishlist
      const memberCheck = await db.query(`
          SELECT * FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
      `, [wishlistId, userId]);

      if (memberCheck.rows.length > 0) {
          return res.status(400).json({ message: "User is already a member of this wishlist" });
      }
      
      // Add the user to the wishlist
      await db.query(`
          INSERT INTO wishlist_members (wishlists_id, user_id, blind, owner, dateCreated)
          VALUES ($1, $2, COALESCE($3, false), COALESCE($4, false), NOW());`, [wishlistId, userId, blind, owner]);

      res.status(201).json({ message: "User added to the wishlist successfully" });
  } catch (error) {
      console.error("Error adding member to wishlist:", error);
      res.status(500).json({ message: "Error adding member to wishlist" });
  }
});



// localhost:3000/wishlists/:id/members?page=1&pageSize=10
// remove a member from an wishlist
router.delete('/:id/members', authenticate, async (req, res) => {
  const wishlistId = parseInt(req.params.id);
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { userId } = req.body;  // Expecting the user to provide the userId of the member to remove

  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // make sure user is the owner of the wishlist before allowing editing of others memberships
    const ownershipCheck = await db.query(`
      SELECT m.owner
      FROM wishlist_members m
      WHERE m.user_id = $1 AND m.wishlists_id = $2;
      `, [authUserId, wishlistId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied. You are not a member of this wishlist." });
    }

    if (!ownershipCheck.rows[0].owner) {
      return res.status(403).json({ error: "Only the owner can edit this wishlist membership." });
    }


      // Check if the user is a member of the wishlist
      const memberCheck = await db.query(`
          SELECT * FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
      `, [wishlistId, userId]);

      if (memberCheck.rows.length === 0) {
          return res.status(404).json({ message: "User is not a member of this wishlist" });
      }

      // Remove the user from the wishlist
      await db.query(`
          DELETE FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
      `, [wishlistId, userId]);

      res.json({ message: "User removed from the wishlist successfully" });
  } catch (error) {
      console.error("Error removing member from wishlist:", error);
      res.status(500).json({ message: "Error removing member from wishlist" });
  }
});



// localhost:3000/wishlists/:id/members?page=1&pageSize=10
// edit a member in an wishlist
router.put('/:id/members', authenticate, async (req, res) => {
  const wishlistId = parseInt(req.params.id);
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { userId, blind, owner } = req.body;  // the user provides the userId of the member to add
  
  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      // make sure user is the owner of the wishlist before allowing editing of others memberships
      const ownershipCheck = await db.query(`
        SELECT m.owner
        FROM wishlist_members m
        WHERE m.user_id = $1 AND m.wishlists_id = $2;
        `, [authUserId, wishlistId]);
  
      if (ownershipCheck.rows.length === 0) {
        return res.status(403).json({ error: "Access denied. You are not a member of this wishlist." });
      }
  
      if (!ownershipCheck.rows[0].owner) {
        return res.status(403).json({ error: "Only the owner can edit this wishlist membership." });
      }

      // Get the membership ID
      const memberCheck = await db.query(`
          SELECT * FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
      `, [wishlistId, userId]);

      
      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ message: "User is not a member of this wishlist" });
      }

      // edit a users membership
      const result = await db.query(`
        UPDATE wishlist_members
        SET 
            blind = COALESCE($1, blind),
            owner = COALESCE($2, owner),
            dateUpdated = NOW()
        WHERE id = $7
        RETURNING *;
      `, [blind, owner, memberCheck.rows[0].id]);

      res.json({ message: "membership updated successfully.", membership: result.rows[0] });
  } catch (error) {
      console.error("Error editing membership to wishlist:", error);
      res.status(500).json({ message: "Error editing membership to wishlist" });
  }
});



// localhost:3000/wishlists/:id/items
// get list of items under a wishlist
router.get('/:wishlistId/items', authenticate, async (req, res) => {
  const wishlistId = parseInt(req.params.wishlistId);

  try {
      const result = await db.query(`
          SELECT i.* FROM items i
          JOIN wishlist_members wm ON i.member_id = wm.id
          WHERE wm.wishlists_id = $1;
      `, [wishlistId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "No items found for this wishlist" });
      }

      res.json({ items: result.rows });
  } catch (error) {
      console.error("Error fetching items for wishlist:", error);
      res.status(500).json({ message: "Error fetching items" });
  }
});



  




  module.exports = router;