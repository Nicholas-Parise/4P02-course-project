const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./authenticate');


// localhost:3000/events?page=1&pageSize=10
// get list of events accesible to user
router.get('/', authenticate, async(req,res,next)=>{
    
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    
    const result = await db.query(`
        SELECT e.id, e.name, e.description, e.url, e.addr, e.city, e.image, e.dateUpdated, e.dateCreated
        FROM events e
        JOIN event_members m ON e.id = m.event_id
        WHERE m.user_id = $1;`, [userId]);

    res.json(result.rows);
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

    const {name, description, url, addr, city, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    await db.query("BEGIN"); // Start a transaction since we want to go all or nothing

    // Step 1: Insert events
    const eventResult = await db.query(
        `INSERT INTO events (name, description, url, addr, city, image, dateCreated, dateUpdated) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
        [name, description, url, addr, city, image]
    );

    const event_id = eventResult.rows[0].id;

    // Step 2: Add the users membership (owner)
    await db.query(
        `INSERT INTO event_members (user_id, event_id, owner, dateCreated, dateUpdated)
        VALUES ($1, $2, TRUE, NOW(), NOW())`,
        [user_id, event_id]
    );

    await db.query("COMMIT"); // Commit the transaction
    
    res.status(201).json({ event_id, message: "Event created successfully!" });
  
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
      SELECT e.id, e.name, e.description, e.url, e.addr, e.city, e.image, e.dateUpdated, e.dateCreated
      FROM events e
      JOIN event_members m ON e.id = m.event_id
      WHERE m.user_id = $1 AND e.id = $2;`, [userId,eventId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "event not found." });
      }


  res.json(result.rows[0]);
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
const {name, description, url, addr, city, image } = req.body;


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
        dateUpdated = NOW()
    WHERE id = $7
    RETURNING *;
  `, [name, description, url, addr, city, image, eventId]);


  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Event not found." });
  }

  res.json({ message: "Event updated successfully.", event: result.rows[0] });


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
  
    res.json({ message: "event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
  });





  module.exports = router;