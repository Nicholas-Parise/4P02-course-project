const express = require('express');
const router = express.Router();
const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const authenticate = require('./middleware/authenticate');
const createNotification = require("./middleware/createNotification");
const sendEmail = require("./middleware/sendEmail");
const mustache = require('mustache');
const fs = require('fs/promises');
const path = require('path');

// localhost:3000/wishlists?page=1&pageSize=10
// get list of wishlists from a member or is in an event 
router.get('/', authenticate, async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(`
          SELECT w.*, u.displayname AS creator_displayName, m.blind, m.owner
          FROM wishlists w
          JOIN wishlist_members m ON w.id = m.wishlists_id
          LEFT JOIN users u ON w.creator_id = u.id
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

    const { event_id, name, description, image, deadline, notifications } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    // Get number of created wishlists, and user pro status
    const proPrevent = await db.query(
      `SELECT 
      (SELECT COUNT(*) FROM wishlists WHERE creator_id = $1) AS count,
      (SELECT pro FROM users WHERE id = $1) AS pro;`,
      [user_id]
    );

    //console.log(proPrevent);
    if (!proPrevent.rows[0].pro && proPrevent.rows[0].count > 2) {
      return res.status(403).json({ error: "you must be pro to make more than 3 wishlists" });
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
      `INSERT INTO wishlists (event_id, name, description, image, deadline, share_token, creator_id, dateCreated) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [event_id, newName, description, image, deadline, shareToken, user_id]
    );

    const wishlist = wishlistResult.rows[0];
    const wishlist_id = wishlistResult.rows[0].id;

    // Step 2: Add the users membership (owner)
    await db.query(
      `INSERT INTO wishlist_members (user_id, wishlists_id, notifications, blind, owner, dateCreated)
          VALUES ($1, $2, COALESCE($3, true), FALSE, TRUE, NOW())`,
      [user_id, wishlist_id, notifications]
    );

    await db.query("COMMIT"); // Commit the transaction

    const owner = true;

    res.status(201).json({ wishlist: { ...wishlist, owner }, message: "Wishlist created successfully!" });

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
    /*
        const result = await db.query(`
          SELECT w.*, u.displayname AS creator_displayName, m.blind, m.owner, m.notifications
          FROM wishlists w
          JOIN wishlist_members m ON w.id = m.wishlists_id
          LEFT JOIN users u ON w.creator_id = u.id
          WHERE m.user_id = $1 AND w.id = $2;`, [userId, wishlistId]);
    */

    const result = await db.query(`
      SELECT w.*, 
            u.displayname AS creator_displayName,
            wm.blind AS blind,
            wm.owner AS owner,
            wm.notifications,
            (wm.user_id IS NOT NULL) AS is_wishlist_member,
            (em.user_id IS NOT NULL) AS is_event_member
      FROM wishlists w
      LEFT JOIN wishlist_members wm ON wm.user_id = $1 AND wm.wishlists_id = w.id
      LEFT JOIN event_members em ON em.user_id = $1 AND em.event_id = w.event_id
      LEFT JOIN users u ON w.creator_id = u.id
      WHERE w.id = $2
      LIMIT 1;
      `, [userId, wishlistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "wishlist not found." });
    }

    const wishlist = result.rows[0];

    // if the user doesn't have a membership to either the event or the wishlist
    if (!wishlist.is_wishlist_member && !wishlist.is_event_member) {
      return res.status(403).json({ error: "You are not a member of this wishlist." });
    }

    // Get all items
    const itemsResult = await db.query(`
      SELECT i.id, i.name, i.description, i.url, i.image, i.quantity, i.price, i.priority, i.dateUpdated, i.dateCreated, u.displayName AS user_displayName, u.id AS user_id 
      FROM items i
      JOIN wishlist_members wm ON i.member_id = wm.id
      JOIN users u ON wm.user_id = u.id
      WHERE wm.wishlists_id = $1
      ORDER BY i.priority;`, [wishlistId]);

    let contributionResult = null;

    if (!wishlist.blind) {  // return the contributions but only if user is not blind 
      contributionResult = await db.query(
        `SELECT c.id, c.item_id, c.quantity, c.purchased, c.note, c.dateUpdated, c.dateCreated, u.picture, u.pro, u.displayName AS user_displayName, u.id AS user_id
        FROM contributions c
        JOIN wishlist_members wm ON c.member_id = wm.id
        JOIN users u ON wm.user_id = u.id
        WHERE wm.wishlists_id = $1;`,
        [wishlistId]
      );
      contributionResult = contributionResult.rows;
    }

    const memberResult = await db.query(`
            SELECT u.id, u.displayName, u.email, u.picture, u.pro, wm.blind, wm.owner
            FROM users u
            JOIN wishlist_members wm ON u.id = wm.user_id
            WHERE wm.wishlists_id = $1;
        `, [wishlistId]);


    res.status(200).json({ wishlist, items: itemsResult.rows, contributions: contributionResult, members: memberResult.rows });
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


    let tempDeadline = deadline;
    let tempEventId = event_id;

    if (deadline && typeof deadline === "string") {
      if (deadline.toLowerCase() === "null") {
        tempDeadline = null;
        await db.query(`
          UPDATE wishlists
          SET 
              deadline = NULL,
              dateUpdated = NOW()
          WHERE id = $1;
        `, [wishlistId]);
      }
    }

    // if event id is something and is a string
    if (event_id && typeof event_id === "string") {
      if (event_id.toLowerCase() === "null") {
        tempEventId = null;
        // Update the wishlist with provided values (only update fields that are passed)
        await db.query(`
          UPDATE wishlists
          SET 
              event_id = NULL,
              dateUpdated = NOW()
          WHERE id = $1;
        `, [wishlistId]);
      }else{
        return res.status(400).json({ error: "You must send \"null\" if you want to remove an event_id." });
      }
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
    `, [tempEventId, name, description, image, tempDeadline, wishlistId]);

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
      if (highestNum > 0) {
        newName = `${newName} (${highestNum + 1})`
      } else {
        newName = `${newName} (2)`;   // if there is only one duplicate and it is called: name 
      }
    }

    const shareToken = uuidv4(); // need to make a unique share token for this 

    await db.query("BEGIN"); // Start a transaction

    // Create the duplicated wishlist
    const newWishlistResult = await db.query(
      `INSERT INTO wishlists (event_id, name, description, image, deadline, share_token, creator_id, dateCreated) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *;`,
      [event_id, newName, description, image, deadline, shareToken, user_id]
    );

    const newWishlist = newWishlistResult.rows[0];
    const newWishlistId = newWishlist.id;

    // make creator owner
    const membersResult = await db.query(
      `INSERT INTO wishlist_members (user_id, wishlists_id, blind, owner, notifications, dateCreated)
       VALUES ($1, $2, false, true, true, NOW()) RETURNING id;`,
      [user_id, newWishlistId]
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
          SELECT u.id, u.displayName, u.email, u.picture, wm.blind, wm.owner
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
          INSERT INTO wishlist_members (wishlists_id, user_id, blind, owner, notifications, dateCreated)
          VALUES ($1, $2, COALESCE($3, false), COALESCE($4, false), true, NOW());`, [wishlistId, userId, blind, owner]);

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
      SELECT * FROM wishlists WHERE share_token = $1;
    `, [share_token]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    const wishlistId = wishlistCheck.rows[0].id;
    const eventId = wishlistCheck.rows[0].event_id;

    // Check if the user is already a member of the wishlist
    const memberCheck = await db.query(`
          SELECT * FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
      `, [wishlistId, authUserId]);

    if (memberCheck.rows.length > 0) {
      return res.status(409).json({ message: "user is already a member", id: wishlistId });
    }

    // Add the user to the wishlist with 
    /*
    await db.query(`
          INSERT INTO wishlist_members (wishlists_id, user_id, blind, owner, dateCreated)
          VALUES ($1, $2, COALESCE($3, false), COALESCE($4, false), NOW());`, [wishlistId, authUserId, blind, owner]);
    */

    // add the 
    await db.query(`
      INSERT INTO wishlist_members (wishlists_id, user_id, blind, owner, notifications, dateCreated)
      VALUES ($1, $2, false, false, true, NOW()) ON CONFLICT DO NOTHING;`, [wishlistId, authUserId]);

    /*
  // add the event membership
  await db.query(`
    INSERT INTO event_members (event_id, user_id, owner, dateCreated)
    VALUES ($1, $2, false, NOW()) ON CONFLICT DO NOTHING;`, [eventId, authUserId]);
  */

    res.status(201).json({ message: "User added to the wishlist successfully", id: wishlistId });
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
// must be owner to remove another member
// but you can remove yourslef 
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

    // if the user is trying to remove themselves then they are allowed to.
    if (userId !== authUserId) {
      // make sure user is the owner of the wishlist before allowing removing others members
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
    }

    // Check if the user is a member of the wishlist
    const memberCheck = await db.query(`
          SELECT 1 FROM wishlist_members WHERE wishlists_id = $1 AND user_id = $2
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
  const { userId, blind, owner, notifications } = req.body;  // the user provides the userId of the member to add

  let result;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {

    const wishlistCheck = await db.query(`
      SELECT id,name FROM wishlists WHERE id = $1;
    `, [wishlistId]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    // Get the membership ID & user existance check
    const memberCheck = await db.query(`
      SELECT wm.*, u.displayName 
      FROM wishlist_members wm
      JOIN users u ON wm.user_id = u.id
      WHERE wm.wishlists_id = $1 AND wm.user_id = $2;
    `, [wishlistId, userId]);

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ message: "User is not a member of this wishlist" });
    }


    // make sure user is the owner of the wishlist before allowing editing of others memberships
    const ownershipCheck = await db.query(`
      SELECT m.owner,
      (SELECT COUNT(*)::int FROM wishlist_members WHERE wishlists_id = $2 AND owner = TRUE) AS owner_count
      FROM wishlist_members m
      WHERE m.user_id = $1 AND m.wishlists_id = $2;
      `, [authUserId, wishlistId]);


    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied. You are not a member of this wishlist." });
    }


    // if it is another user trying to edit someone elses membership
    if (userId !== authUserId) {

      if (!ownershipCheck.rows[0].owner) {
        return res.status(403).json({ error: "Only the owner can edit this wishlist membership." });
      }

      // if owner isn't null, and owner is false
      if (typeof owner !== 'undefined' && owner !== null && !owner) {
        // we are taking away someones ownership
        if (ownershipCheck.rows[0].owner_count <= 1) {
          return res.status(403).json({ error: "Cannot remove an owner when only one left." });
        }
      }

      // edit a users membership
      result = await db.query(`
        UPDATE wishlist_members
        SET 
            blind = COALESCE($1, blind),
            owner = COALESCE($2, owner),
            notifications = COALESCE($3, notifications),
            dateUpdated = NOW()
        WHERE id = $4
        RETURNING blind,owner,notifications,dateUpdated;
      `, [blind, owner, notifications, memberCheck.rows[0].id]);


      // if blind isn't null, and blind is false
      if (typeof blind !== 'undefined' && blind !== null && !blind) {
        await notifyAllOnBlind(wishlistId, userId, memberCheck.rows[0].displayname, wishlistCheck.rows[0].name);
      }

    } else {
      // if the user is trying to edit their notifications
      // edit your own membership

      // if owner isn't null, and owner is false
      if (typeof owner !== 'undefined' && owner !== null && !owner) {
        // we must make sure we don't take away owner if only one owner left
        if (ownershipCheck.rows[0].owner_count <= 1) {
          return res.status(403).json({ error: "Cannot remove yourself as an owner when you're the only one." });
        }
      }


      if (ownershipCheck.rows[0].owner) {
        // you are the owner so you can change anything
        result = await db.query(`
        UPDATE wishlist_members
        SET 
            blind = COALESCE($1, blind),
            owner = COALESCE($2, owner),
            notifications = COALESCE($3, notifications),
            dateUpdated = NOW()
        WHERE id = $4
        RETURNING blind,owner,notifications,dateUpdated;
      `, [blind, owner, notifications, memberCheck.rows[0].id]);

        // if blind isn't null, and blind is false
        if (typeof blind !== 'undefined' && blind !== null && !blind) {
          await notifyAllOnBlind(wishlistId, userId, memberCheck.rows[0].displayname, wishlistCheck.rows[0].name);
        }

      } else {
        // you are not an owner so you can only change your notifications
        result = await db.query(`
        UPDATE wishlist_members
        SET 
            notifications = COALESCE($1, notifications),
            dateUpdated = NOW()
        WHERE id = $2
        RETURNING blind,owner,notifications,dateUpdated;
      `, [notifications, memberCheck.rows[0].id]);
      }
    }

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
      WHERE wm.wishlists_id = $1
      ORDER BY i.priority;`, [wishlistId]);

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
      WHERE wm.wishlists_id = $1 
      ORDER BY i.priority;`, [wishlist.id]);

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

  if (!wishlist_id || !email) {
    return res.status(400).json({ message: "wishlist_id and email are required" });
  }

  try {
    const wishlistCheck = await db.query(`
      SELECT id,share_token,name,deadline,description FROM wishlists WHERE id = $1;
    `, [wishlist_id]);

    if (wishlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    const list_name = wishlistCheck.rows[0].name;
    const event_date = wishlistCheck.rows[0].deadline;
    const list_description = wishlistCheck.rows[0].description;

    // Check if the user exists
    const userCheck = await db.query(`
      SELECT id,displayName,notifications FROM users WHERE email = $1;
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
      const toUser = userCheck.rows[0].displayname;

      await db.query(`
        INSERT INTO wishlist_members (user_id, wishlists_id, owner, blind, notifications, dateCreated, dateUpdated)
        VALUES ($1, $2, false, false, true, NOW(), NOW()) ON CONFLICT DO NOTHING;
      `, [memberUserId, wishlist_id]);

      // send notification, make sure they allow notifications
      if (userCheck.rows[0].notifications) {
        await createNotification([memberUserId], "You've been invited to a wishlist!", `${fromUser} has invited you to the wishlist: ${list_name}`, `/wishlists/${wishlistCheck.rows[0].id}`);
        await memberAdded(email, toUser, fromUser, list_name, event_date, list_description, `https://wishify.ca/wishlists/${wishlistCheck.rows[0].id}`);
      }


      return res.status(200).json({ message: "User added to wishlist." });
    } else {
      // else send an email to that user with an invite link 

      const inviteLink = `https://wishify.ca/register?wishlist=${wishlistCheck.rows[0].share_token}`;

      await memberInvite(email, fromUser, list_name, event_date, list_description, inviteLink);

    }

    return res.status(200).json({ message: "Invitation sent." });
  } catch (error) {
    console.error("Error fetching shared wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


async function memberInvite(to, sender_name, list_name, event_date, list_description, register_link) {
  try {
    let htmlTemplate = await fs.readFile(path.join(__dirname, './emailtemplates/MemberInvite.html'), 'utf8');

    const renderedHtml = mustache.render(htmlTemplate, {
      sender_name,
      list_type: 'Wishlist',
      list_name,
      event_date,
      list_description,
      register_link,
      current_year: new Date().getFullYear()
    });

    await sendEmail(to, `${sender_name} has invited you to collaborate on their wishlist!`, null, renderedHtml);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


async function memberAdded(to, recipient_name, sender_name, list_name, event_date, list_description, view_link) {
  try {
    let htmlTemplate = await fs.readFile(path.join(__dirname, './emailtemplates/MemberAdded.html'), 'utf8');

    const renderedHtml = mustache.render(htmlTemplate, {
      recipient_name,
      sender_name,
      list_type: 'Wishlist',
      list_name,
      event_date,
      list_description,
      view_link,
      current_year: new Date().getFullYear()
    });

    await sendEmail(to, `${sender_name} has invited you to collaborate on their wishlist!`, null, renderedHtml);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}



async function notifyAllOnBlind(wishlists_id, user_id, user_name, wishlist_name) {
  try {
    /// get all members of wishlist, and get their notificatons status
    const { rows: members } = await db.query(
      `SELECT wm.user_id, wm.notifications AS member_notifications, u.notifications AS user_notifications 
      FROM wishlist_members wm
      JOIN users u ON wm.user_id = u.id
      WHERE wm.wishlists_id = $1;`,
      [wishlists_id]);

    // get array of users ids where both notifications are true 
    const notifyMembers = members
      .filter(member => member.member_notifications && member.user_notifications && member.user_id != user_id)
      .map(member => member.user_id);

    await createNotification(notifyMembers,
      "a user is no longer blind",
      `${user_name} is no longer blind in the wishlist: ${wishlist_name}`,
      `/wishlists/${wishlists_id}`);
  } catch (error) {
    console.error("Error sending item notifications:", error);
  }
}


module.exports = router;
