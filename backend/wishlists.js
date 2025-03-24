const express = require('express');
const router = express.Router();
const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const authenticate = require('./middleware/authenticate');
const createNotification = require("./middleware/createNotification");
const sendEmail = require("./middleware/sendEmail");

// localhost:3000/wishlists?page=1&pageSize=10
// get list of wishlists from a member or is in an event 
router.get('/', authenticate, async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(`
          SELECT w.*, m.blind, m.owner
          FROM wishlists w
          JOIN wishlist_members m ON w.id = m.wishlists_id
          WHERE m.user_id = $1;`, [userId]);

    res.status(200).json(result.rows);
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

  try {
    const user_id = req.user.userId; // Get user ID from authenticated request

    const { event_id, name, description, image, deadline } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    // make sure name is unique with a user
    // this query gets the most recently created wishlist with a name like the one provided
    const checkNames = await db.query(
      `SELECT name FROM wishlists w
       JOIN wishlist_members wm ON w.id = wm.wishlists_id
       WHERE wm.user_id = $1 AND wm.owner = TRUE AND w.name LIKE $2
       ORDER BY w.dateCreated DESC`,  // Get the most recently created duplicate
      [user_id, `${name}%`]
    );

    let newName = name;

    const escapedRegex = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    if (checkNames.rows.length > 0) {
      // we get the latest name 
      const existingNames = checkNames.rows.map(row => row.name);
      const regex = new RegExp(`^${escapedRegex} \\((\\d+)\\)$`);
      //const regex = new RegExp(`^${name}(?: \\(([^)]+)\\))*( \\((\\d+)\\))?$`);

      let highestNum = 0;
      for (const existingName of existingNames) {

        // Ignore names containing "(copy)"
        if (existingName.toLowerCase().includes("(copy)")) {
          continue;
        }

        const match = existingName.match(regex);
        if (match) {
          highestNum = Math.max(highestNum, parseInt(match[1]));
        }
      }
      // if there is only one duplicate and it is called: name 
      newName = highestNum > 0 ? `${name} (${highestNum + 1})` : `${name} (2)`;
    }

    const shareToken = uuidv4();

    await db.query("BEGIN"); // Start a transaction since we want to go all or nothing

    // Step 1: Insert wishlist
    const wishlistResult = await db.query(
      `INSERT INTO wishlists (event_id, name, description, image, deadline, share_token, dateCreated, dateUpdated) 
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
      [event_id, newName, description, image, deadline, shareToken]
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

  } catch (error) {
    await db.query("ROLLBACK"); // Rollback if an error occurs
    res.status(500).json({ error: error.message });
  }

});


// localhost:3000/wishlists/0
// get the contents of a single wishlist, items and contributions
router.get('/:wishlistId', authenticate, async (req, res, next) => {

  const wishlistId = parseInt(req.params.wishlistId);

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(`
        SELECT w.*, m.blind, m.owner
        FROM wishlists w
        JOIN wishlist_members m ON w.id = m.wishlists_id
        WHERE m.user_id = $1 AND w.id = $2;`, [userId, wishlistId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "wishlist not found." });
    }

    const wishlist = result.rows[0]

    // Get all items
    const itemsResult = await db.query(`
      SELECT i.id, i.name, i.description, i.url, i.image, i.quantity, i.price, i.priority, i.dateUpdated, i.dateCreated, u.displayName AS user_displayName, u.id AS user_id 
      FROM items i
      JOIN wishlist_members wm ON i.member_id = wm.id
      JOIN users u ON wm.user_id = u.id
      WHERE wm.wishlists_id = $1;`, [wishlist.id]);

      let contributionResult = null;

      if(!wishlist.blind){  // return the contributions but only if user is not blind 
      contributionResult = await db.query(
        `SELECT c.id, c.item_id, c.quantity, c.purchased, c.note, c.dateUpdated, c.dateCreated, u.displayName AS user_displayName, u.id AS user_id
        FROM contributions c
        JOIN wishlist_members wm ON c.member_id = wm.id
        JOIN users u ON wm.user_id = u.id
        WHERE wm.wishlists_id = $1;`,
        [wishlistId]
      );
    }

    
        
    res.status(200).json({ wishlist, items: itemsResult.rows, contributions: contributionResult.rows });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/wishlists/0
// delete a wishlist, but only if user is a member and is the owner.
router.delete('/:wishlistId', authenticate, async (req, res, next) => {

  const wishlistId = parseInt(req.params.wishlistId);
  const userId = req.user.userId; // Get user ID from the authenticated token

  // make sure user is the owner of the wishlist before allowing deletion
  try {

    const wishlistCheck = await db.query(`
      SELECT id FROM wishlists WHERE id = $1;
    `, [wishlistId]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

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

    res.status(200).json({ message: "Wishlist deleted successfully." });
  } catch (error) {
    console.error("Error deleting  wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/wishlists/0
// edit a wishlist, but only if user is a member and is the owner.
router.put('/:wishlistId', authenticate, async (req, res, next) => {

  const wishlistId = parseInt(req.params.wishlistId);
  const userId = req.user.userId; // Get user ID from the authenticated token
  const { event_id, name, description, image, deadline } = req.body;

  // make sure user is the owner of the wishlist before allowing editing
  try {
    
    const wishlistCheck = await db.query(`
      SELECT id FROM wishlists WHERE id = $1;
    `, [wishlistId]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }
    
    
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

    res.status(200).json({ message: "Wishlist updated successfully.", wishlist: result.rows[0] });

  } catch (error) {
    console.error("Error editing wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/wishlists/:id/duplicate
// Duplicate the wishlist
router.post('/:wishlistId/duplicate', authenticate, async (req, res, next) => {
  try {
    const user_id = req.user.userId; // Get user ID from authenticated request
    const wishlistId = parseInt(req.params.wishlistId);


    //Fetch original wishlist
    const wishlistResult = await db.query(
      `SELECT event_id, name, description, image, deadline 
       FROM wishlists WHERE id = $1`,
      [wishlistId]
    );

    if (wishlistResult.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    const { event_id, name, description, image, deadline } = wishlistResult.rows[0];
    let newName = `${name} (Copy)`;

    // make sure name is unique with a user
    // this query gets the most recently created wishlist with a name like the one provided
    const checkNames = await db.query(
      `SELECT name FROM wishlists w
       JOIN wishlist_members wm ON w.id = wm.wishlists_id
       WHERE wm.user_id = $1 AND wm.owner = TRUE AND w.name LIKE $2
       ORDER BY w.dateCreated DESC`,  // Get the most recently created duplicate
      [user_id, `${newName}%`]
    );

    const escapedRegex = newName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    if (checkNames.rows.length > 0) {
      // we get the latest name 
      const existingNames = checkNames.rows.map(row => row.name);
      const regex = new RegExp(`^${escapedRegex} \\((\\d+)\\)$`);

      let highestNum = 0;
      for (const existingName of existingNames) {
      
        const match = existingName.match(regex);
        if (match) {
          highestNum = Math.max(highestNum, parseInt(match[1]));
        }
      }
      if(highestNum > 0){
        newName = `${newName} (${highestNum + 1})`
      }else{
        newName = `${newName} (2)`;   // if there is only one duplicate and it is called: name 
      }
    }

    const shareToken = uuidv4(); // need to make a unique share token for this 

    await db.query("BEGIN"); // Start a transaction

    // Create the duplicated wishlist
    const newWishlistResult = await db.query(
      `INSERT INTO wishlists (event_id, name, description, image, deadline, share_token, dateCreated) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;`,
      [event_id, newName, description, image, deadline, shareToken]
    );

    const newWishlist = newWishlistResult.rows[0];
    const newWishlistId = newWishlist.id;
   
    // make creator owner
    const membersResult = await db.query(
      `INSERT INTO wishlist_members (user_id, wishlists_id, blind, owner, dateCreated)
       VALUES ($1, $2, false, true, NOW()) RETURNING id;`,
      [user_id,newWishlistId]
    );

    const newMemberId = membersResult.rows[0].id;
    
    /*
    //  Copy wishlist members (keeping same roles)
    const membersResult = await db.query(
      `INSERT INTO wishlist_members (user_id, wishlists_id, blind, owner, dateCreated, dateUpdated)
       SELECT user_id, $1, blind, owner, NOW(), NOW()
       FROM wishlist_members WHERE wishlists_id = $2 RETURNING id, user_id`,
      [newWishlistId, wishlistId]
    );
    */

    // Copy items and assign new member_ids
    const itemsResult = await db.query(
      `INSERT INTO items (member_id, name, description, url, image, quantity, price, dateCreated, priority)
       SELECT $1, name, description, url, image, quantity, price, NOW(), priority
       FROM items WHERE member_id IN (SELECT id FROM wishlist_members WHERE wishlists_id = $2) RETURNING id`,
      [newMemberId, wishlistId] // Assign to the new member_id of the current user
    );
    
    await db.query("COMMIT"); // Commit the transaction

    res.status(201).json({
      wishlist: newWishlist,
      message: "Wishlist duplicated successfully!"
    });

  } catch (error) {
    await db.query("ROLLBACK"); // Rollback on error
    console.error("Error duplicating wishlist:", error);
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

    res.status(200).json({ members: result.rows });
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

    const wishlistCheck = await db.query(`
      SELECT id FROM wishlists WHERE id = $1;
    `, [wishlistId]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

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

    // Handle duplicate membership error
    if (error.code === "23505") { 
      return res.status(409).json({ message: "user is already a member" });
    }

    console.error("Error adding member to wishlist:", error);
    res.status(500).json({ message: "Error adding member to wishlist" });
  }
});


// add a member to an wishlist with the share token
// /wishlists/members
router.post('/members', authenticate, async (req, res) => {
  
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { share_token, blind, owner } = req.body;  // the user provides the share_token of the wishlist to add

  if (!share_token) {
    return res.status(400).json({ message: "share_token is required" });
  }

  try {

    const wishlistCheck = await db.query(`
      SELECT id FROM wishlists WHERE share_token = $1;
    `, [share_token]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    const wishlistId = wishlistCheck.rows[0].id;

    // Check if the user is already a member of the wishlist
    const memberCheck = await db.query(`
          SELECT * FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
      `, [wishlistId, authUserId]);

    if (memberCheck.rows.length > 0) {
      return res.status(409).json({ message: "user is already a member", id: wishlistId });
    }

    // Add the user to the wishlist
    /*
    await db.query(`
          INSERT INTO wishlist_members (wishlists_id, user_id, blind, owner, dateCreated)
          VALUES ($1, $2, COALESCE($3, false), COALESCE($4, false), NOW());`, [wishlistId, authUserId, blind, owner]);
    */

    await db.query(`
      INSERT INTO wishlist_members (wishlists_id, user_id, blind, owner, dateCreated)
      VALUES ($1, $2, false, true, NOW());`, [wishlistId, authUserId]);


    res.status(201).json({ message: "User added to the wishlist successfully" });
  } catch (error) {

    // Handle duplicate membership error
    if (error.code === "23505") { 
      return res.status(409).json({ message: "user is already a member", id: wishlistId });
    }

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

    const wishlistCheck = await db.query(`
      SELECT id FROM wishlists WHERE id = $1;
    `, [wishlistId]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }
    
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

    res.status(200).json({ message: "User removed from the wishlist successfully" });
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

    const wishlistCheck = await db.query(`
      SELECT id FROM wishlists WHERE id = $1;
    `, [wishlistId]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

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

    res.status(201).json({ message: "membership updated successfully.", membership: result.rows[0] });
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
    // Get all items
    const result = await db.query(`
      SELECT i.id, i.name, i.description, i.url, i.image, i.quantity, i.price, i.priority, i.dateUpdated, i.dateCreated, u.displayName AS user_displayName, u.id AS user_id 
      FROM items i
      JOIN wishlist_members wm ON i.member_id = wm.id
      JOIN users u ON wm.user_id = u.id
      WHERE wm.wishlists_id = $1;`, [wishlistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No items found for this wishlist" });
    }

    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error("Error fetching items for wishlist:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});


// localhost:3000/wishlists/share/:id
// get the shared wishlist 
router.get('/share/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Fetch the wishlist by its share token
    const wishlistResult = await db.query(
      `SELECT id, name, description, image, deadline FROM wishlists WHERE share_token = $1`,
      [token]
    );

    if (wishlistResult.rows.length === 0) {
      return res.status(404).json({ error: "Invalid share link or wishlist not found" });
    }

    const wishlist = wishlistResult.rows[0];

    // Get all items
    const itemsResult = await db.query(`
      SELECT i.id, i.name, i.description, i.url, i.image, i.quantity, i.price, i.priority, i.dateUpdated, i.dateCreated, u.displayName AS user_displayName, u.id AS user_id 
      FROM items i
      JOIN wishlist_members wm ON i.member_id = wm.id
      JOIN users u ON wm.user_id = u.id
      WHERE wm.wishlists_id = $1;`, [wishlist.id]);

    res.status(200).json({ wishlist, items: itemsResult.rows });
  } catch (error) {
    console.error("Error fetching shared wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// localhost:3000/wishlists/share
// send emails to share the wishlist 
router.post('/share', authenticate, async (req, res) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const { wishlist_id, email, blind } = req.body;

  if(!wishlist_id || !email){
    return res.status(400).json({ message: "wishlist_id and email are required" }); 
  }

  try {
    const wishlistCheck = await db.query(`
      SELECT id,share_token,name FROM wishlists WHERE id = $1;
    `, [wishlist_id]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    // Check if the user exists
    const userCheck = await db.query(`
      SELECT id FROM users WHERE email = $1;
    `, [email]);
    
      // get name of person doing inviting:
      const fromUserResult = await db.query(`
        SELECT displayName FROM users WHERE id = $1;
      `, [userId]);

      const fromUser = fromUserResult.rows[0].displayname;

      // if the user has an account add them as a member
    if (userCheck.rows.length > 0) {
      // User exists, add them as a wishlist member
      
      const memberUserId = userCheck.rows[0].id;

      await db.query(`
        INSERT INTO wishlist_members (user_id, wishlists_id, owner, blind, dateCreated, dateUpdated)
        VALUES ($1, $2, false, false, NOW(), NOW()) ON CONFLICT DO NOTHING;
      `, [memberUserId, wishlist_id]);

      // send notification:
      await createNotification( [memberUserId], "You've been invited to a wishlist!", `${fromUser} has invited you to the wishlist: ${wishlistCheck.rows[0].name}`, `/wishlists/${wishlistCheck.rows[0].id}` );

      return res.status(200).json({ message: "User added to wishlist." });
    }else{
      // else send an email to that user with an invite link 
      await sendInviteEmail(email, wishlistCheck.rows[0].share_token, fromUser);
    }
    
    return res.status(200).json({ message: "Invitation sent." }); 
  } catch (error) {
    console.error("Error fetching shared wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// send the email to user
async function sendInviteEmail(email, share_token, fromUser) {

  const inviteLink = `https://wishify.ca/register?wishlist=${share_token}`;

  await sendEmail(email, 
    `${fromUser} has invited you to collaborate on their wishlist!`,
  `${fromUser} has invited you to collaborate on their wishlist! Click here to join: ${inviteLink} or copy and paste this link into your browser: ${inviteLink} Best, The Wishify Team`,
`<p><strong>${fromUser}</strong> has invited to their wishlist! Click <a href="${inviteLink}">here</a> to join. <br> Or copy and paste this link into your browser: ${inviteLink}</p><p>Best, The Wishify Team</p>`);

}


module.exports = router;