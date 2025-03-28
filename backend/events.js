const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./middleware/authenticate');


// localhost:3000/events?page=1&pageSize=10
// get list of events accesible to user
router.get('/', authenticate, async(req,res,next)=>{
    
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    
    const result = await db.query(`
        SELECT e.*
        FROM events e
        JOIN event_members m ON e.id = m.event_id
        WHERE m.user_id = $1;`, [userId]);

    res.status(200).json(result.rows);
} catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
}

});


/**
 * localhost:3000/events
 * Create an event
 * A user must be authenticated or it will cause an error
 */
router.post('/', authenticate, async (req, res, next) => {

  try{
    const user_id = req.user.userId; // Get user ID from authenticated request

    const {name, description, url, addr, city, image, deadline } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    await db.query("BEGIN"); // Start a transaction since we want to go all or nothing

    // Step 1: Insert events
    const eventResult = await db.query(
        `INSERT INTO events (name, description, url, addr, city, image, deadline, dateCreated, dateUpdated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id`,
        [name, description, url, addr, city, image, deadline]
    );

    const event_id = eventResult.rows[0].id;
    const event = eventResult.rows[0];

    // Step 2: Add the users membership (owner)
    await db.query(
        `INSERT INTO event_members (user_id, event_id, owner, dateCreated, dateUpdated)
        VALUES ($1, $2, TRUE, NOW(), NOW())`,
        [user_id, event_id]
    );

    await db.query("COMMIT"); // Commit the transaction
    
    res.status(201).json({ event, message: "Event created successfully!" });
  
  }catch (error) {
    await db.query("ROLLBACK"); // Rollback if an error occurs
    res.status(500).json({ error: error.message });
  }

});



// localhost:3000/events/0
// get the contents of a single event
router.get('/:eventId', authenticate, async(req,res,next)=>{
  
const eventId = parseInt(req.params.eventId);
const page = parseInt(req.query.page) || 1;
const pageSize = parseInt(req.query.pageSize) || 10;

try {
  const userId = req.user.userId; // Get user ID from authenticated token

  const result = await db.query(`
      SELECT e.*
      FROM events e
      JOIN event_members m ON e.id = m.event_id
      WHERE m.user_id = $1 AND e.id = $2;`, [userId,eventId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "event not found." });
      }


  res.status(200).json(result.rows[0]);
} catch (error) {
  console.error("Error fetching event:", error);
  res.status(500).json({ error: "Internal Server Error" });
}

});

// localhost:3000/events/0
// edit an event, but only if user is a member and is the owner.
router.put('/:eventId', authenticate, async(req,res,next)=>{
  
const eventId = parseInt(req.params.eventId);
const userId = req.user.userId; // Get user ID from the authenticated token
const {name, description, url, addr, city, image, deadline } = req.body;


// make sure user is the owner of the event before allowing editing
try {
  const ownershipCheck = await db.query(`
    SELECT m.owner
    FROM event_members m
    WHERE m.user_id = $1 AND m.event_id = $2;
    `, [userId, eventId]);

  if (ownershipCheck.rows.length === 0) {
    return res.status(403).json({ error: "Access denied. You are not a member of this event." });
  }

  if (!ownershipCheck.rows[0].owner) {
    return res.status(403).json({ error: "Only the owner can edit this event." });
  }

  // Update the event with provided values (only update fields that are passed)
  const result = await db.query(`
    UPDATE events
    SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        url = COALESCE($3, url),
        addr = COALESCE($4, addr),
        city = COALESCE($5, city),
        image = COALESCE($6, image),
        deadline = COALESCE($7, deadline),
        dateUpdated = NOW()
    WHERE id = $8
    RETURNING *;
  `, [name, description, url, addr, city, image, deadline, eventId]);


  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Event not found." });
  }

  res.status(200).json({ message: "Event updated successfully.", event: result.rows[0] });


} catch (error) {
  console.error("Error editing event:", error);
  res.status(500).json({ error: "Internal Server Error" });
}

});



// localhost:3000/events/0
// delete a event, but only if user is a member and is the owner.
router.delete('/:eventId', authenticate, async(req,res,next)=>{
  
  const eventId = parseInt(req.params.eventId);
  const userId = req.user.userId; // Get user ID from the authenticated token
  
  // make sure user is the owner of the event before allowing deletion
  try {
    const ownershipCheck = await db.query(`
      SELECT m.owner
      FROM event_members m
      WHERE m.user_id = $1 AND m.event_id = $2;
      `, [userId, eventId]);
  
    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied. You are not a member of this event." });
    }
  
    if (!ownershipCheck.rows[0].owner) {
      return res.status(403).json({ error: "Only the owner can delete this event." });
    }
  
    // Delete the event
    await db.query(`DELETE FROM events WHERE id = $1;`, [eventId]);
  
    res.status(200).json({ message: "event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
  });




// localhost:3000/events/:eventId/wishlists?page=1&pageSize=10
// get list of wishlists under an event
router.get('/:eventId/wishlists', authenticate, async(req,res,next)=>{
   
const eventId = parseInt(req.params.eventId);
const page = parseInt(req.query.page) || 1;
const pageSize = parseInt(req.query.pageSize) || 10;

try {
  const result = await db.query(`
      SELECT w.id, w.name, w.description, w.dateCreated
            FROM wishlists w
            JOIN events e ON w.event_id = e.id
            WHERE e.id = $1;`, [eventId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No wishlists found for this event" });
        }


      res.status(200).json({ wishlists: result.rows });
} catch (error) {
  console.error("Error fetching wishlists for event:", error);
  res.status(500).json({ error: "Internal Server Error" });
}

});


// localhost:3000/events/:eventId/members?page=1&pageSize=10
// get list of members under an event
router.get('/:id/members', authenticate, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
      const result = await db.query(`
          SELECT u.id, u.displayName, u.email, u.picture
          FROM users u
          JOIN event_members em ON u.id = em.user_id
          WHERE em.event_id = $1;
      `, [eventId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "No members found for this event" });
      }

      res.status(200).json({ members: result.rows });
  } catch (error) {
      console.error("Error fetching members for event:", error);
      res.status(500).json({ message: "Error fetching members" });
  }
});



// localhost:3000/events/:id/members?page=1&pageSize=10
// add a member to an event
router.post('/:id/members', authenticate, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { userId, owner } = req.body;  // the user provides the userId of the member to add

  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // make sure user is the owner of the event before allowing editing of others memberships
        const ownershipCheck = await db.query(`
          SELECT m.owner
          FROM event_members m
          WHERE m.user_id = $1 AND m.event_id = $2;
          `, [authUserId, wishlistId]);
  
        if (ownershipCheck.rows.length === 0) {
          return res.status(403).json({ error: "Access denied. You are not a member of this event." });
        }
  
        if (!ownershipCheck.rows[0].owner) {
          return res.status(403).json({ error: "Only the owner can add a member to this event." });
        }


      // Check if the user is already a member of the event
      const memberCheck = await db.query(`
          SELECT * FROM event_members WHERE event_id = $1 AND user_id = $2
      `, [eventId, userId]);

      if (memberCheck.rows.length > 0) {
          return res.status(400).json({ message: "User is already a member of this event" });
      }
      
      // Add the user to the event
      await db.query(`
          INSERT INTO event_members (event_id, user_id, owner, dateCreated)
          VALUES ($1, $2, COALESCE($3, false), NOW());`, [eventId, userId, owner]);

      res.status(201).json({ message: "User added to the event successfully" });
  } catch (error) {

    // Handle duplicate membership error
    if (error.code === "23505") { 
      return res.status(409).json({ message: "user is already a member" });
    }

    console.error("Error adding member to event:", error);
    res.status(500).json({ message: "Error adding member to event" });
  }
});



// localhost:3000/events/:id/members?page=1&pageSize=10
// remove a member from an event
router.delete('/:id/members', authenticate, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { userId } = req.body;  // Expecting the user to provide the userId of the member to remove

  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      // make sure user is the owner of the event before allowing editing of others memberships
      const ownershipCheck = await db.query(`
        SELECT m.owner
        FROM event_members m
        WHERE m.user_id = $1 AND m.event_id = $2;
        `, [authUserId, wishlistId]);

      if (ownershipCheck.rows.length === 0) {
        return res.status(403).json({ error: "Access denied. You are not a member of this event." });
      }

      if (!ownershipCheck.rows[0].owner) {
        return res.status(403).json({ error: "Only the owner can remove a member to this event." });
      }


      // Check if the user is a member of the event
      const memberCheck = await db.query(`
          SELECT * FROM event_members WHERE event_id = $1 AND user_id = $2
      `, [eventId, userId]);

      if (memberCheck.rows.length === 0) {
          return res.status(404).json({ message: "User is not a member of this event" });
      }

      // Remove the user from the event
      await db.query(`
          DELETE FROM event_members WHERE event_id = $1 AND user_id = $2
      `, [eventId, userId]);

      res.status(200).json({ message: "User removed from the event successfully" });
  } catch (error) {
      console.error("Error removing member from event:", error);
      res.status(500).json({ message: "Error removing member from event" });
  }
});



// localhost:3000/events/:id/members?page=1&pageSize=10
// edit a membership to an event
router.put('/:id/members', authenticate, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { userId, owner } = req.body;  // the user provides the userId of the member to add

  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // make sure user is the owner of the event before allowing editing of others memberships
        const ownershipCheck = await db.query(`
          SELECT m.owner
          FROM event_members m
          WHERE m.user_id = $1 AND m.event_id = $2;
          `, [authUserId, wishlistId]);
  
        if (ownershipCheck.rows.length === 0) {
          return res.status(403).json({ error: "Access denied. You are not a member of this event." });
        }
  
        if (!ownershipCheck.rows[0].owner) {
          return res.status(403).json({ error: "Only the owner can edit a member to this event." });
        }


      // Check if the user is already a member of the event
      const memberCheck = await db.query(`
          SELECT * FROM event_members WHERE event_id = $1 AND user_id = $2
      `, [eventId, userId]);

      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ message: "User is not a member of this event" });
      }

      
      // edit a users membership
          const result = await db.query(`
            UPDATE event_members
            SET 
                owner = COALESCE($2, owner),
                dateUpdated = NOW()
            WHERE id = $7
            RETURNING *;
          `, [owner, memberCheck.rows[0].id]);
      
          res.status(200).json({ message: "membership updated successfully.", membership: result.rows[0] });
  } catch (error) {
      console.error("Error adding member to event:", error);
      res.status(500).json({ message: "Error adding member to event" });
  }
});




  module.exports = router;