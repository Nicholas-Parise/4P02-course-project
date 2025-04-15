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

// localhost:3000/events?page=1&pageSize=10
// get list of events accesible to user
router.get('/', authenticate, async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(`
        SELECT e.*, u.displayname AS creator_displayName
        FROM events e
        JOIN event_members m ON e.id = m.event_id
        LEFT JOIN users u ON e.creator_id = u.id
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

  try {
    const user_id = req.user.userId; // Get user ID from authenticated request

    const { name, description, url, addr, city, image, deadline } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const shareToken = uuidv4();

    await db.query("BEGIN"); // Start a transaction since we want to go all or nothing

    // Step 1: Insert events
    const eventResult = await db.query(
      `INSERT INTO events (name, description, url, addr, city, image, deadline, share_token, creator_id,dateCreated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [name, description, url, addr, city, image, deadline, shareToken, user_id]
    );

    const event_id = eventResult.rows[0].id;
    const event = eventResult.rows[0];

    // Step 2: Add the users membership (owner)
    await db.query(
      `INSERT INTO event_members (user_id, event_id, owner, notifications, dateCreated)
        VALUES ($1, $2, TRUE, TRUE, NOW())`,
      [user_id, event_id]
    );

    await db.query("COMMIT"); // Commit the transaction

    res.status(201).json({ event, message: "Event created successfully!" });

  } catch (error) {
    await db.query("ROLLBACK"); // Rollback if an error occurs
    res.status(500).json({ error: error.message });
  }

});



// localhost:3000/events/0
// get the contents of a single event
router.get('/:eventId', authenticate, async (req, res, next) => {

  const eventId = parseInt(req.params.eventId);
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(`
      SELECT e.*, u.displayname AS creator_displayName
      FROM events e
      JOIN event_members m ON e.id = m.event_id
      LEFT JOIN users u ON e.creator_id = u.id
      WHERE m.user_id = $1 AND e.id = $2;`, [userId, eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found." });
    }


    const wishlistResult = await db.query(`
      SELECT w.*, u.displayname AS creator_displayName
      FROM wishlists w
      JOIN events e ON w.event_id = e.id
      LEFT JOIN users u ON w.creator_id = u.id
      WHERE e.id = $1;`, [eventId]);


    const memberResult = await db.query(`
      SELECT u.id, u.displayName, u.email, u.picture, u.pro, em.owner
      FROM users u
      JOIN event_members em ON u.id = em.user_id
      WHERE em.event_id = $1;
    `, [eventId]);

    const event = result.rows[0];

    res.status(200).json({ event, wishlists: wishlistResult.rows, members: memberResult.rows });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});

// localhost:3000/events/0
// edit an event, but only if user is a member and is the owner.
router.put('/:eventId', authenticate, async (req, res, next) => {

  const eventId = parseInt(req.params.eventId);
  const userId = req.user.userId; // Get user ID from the authenticated token
  const { name, description, url, addr, city, image, deadline } = req.body;


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
router.delete('/:eventId', authenticate, async (req, res, next) => {

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
router.get('/:eventId/wishlists', authenticate, async (req, res, next) => {

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
  const { userId, owner, notifications } = req.body;  // the user provides the userId of the member to add

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
                owner = COALESCE($1, owner),
                notifications = COALESCE($2, notifications),
                dateUpdated = NOW()
            WHERE id = $3
            RETURNING *;
          `, [owner, notifications, memberCheck.rows[0].id]);

    res.status(200).json({ message: "membership updated successfully.", membership: result.rows[0] });
  } catch (error) {
    console.error("Error adding member to event:", error);
    res.status(500).json({ message: "Error adding member to event" });
  }
});



// add a member to an event with the share token
// /events/members
router.post('/members', authenticate, async (req, res) => {

  const authUserId = req.user.userId; // Get user ID from the authenticated token
  const { share_token, owner } = req.body;  // the user provides the share_token of the event to add

  if (!share_token) {
    return res.status(400).json({ message: "share_token is required" });
  }

  try {

    const eventsCheck = await db.query(`
      SELECT * FROM events WHERE share_token = $1;
    `, [share_token]);

    if (eventsCheck.rows.length === 0) {
      return res.status(404).json({ error: "event not found." });
    }

    const eventId = eventsCheck.rows[0].id;

    // Check if the user is already a member of the event
    const memberCheck = await db.query(`
          SELECT * FROM event_members WHERE event_id = $1 AND user_id = $2
      `, [eventId, authUserId]);

    if (memberCheck.rows.length > 0) {
      return res.status(409).json({ message: "user is already a member", id: eventId });
    }

    // add user to the event
    await db.query(`
      INSERT INTO event_members (event_id, user_id, owner, notifications, dateCreated)
      VALUES ($1, $2, false, true, NOW()) ON CONFLICT DO NOTHING;`, [eventId, authUserId]);


    res.status(201).json({ message: "User added to the event successfully", id: eventId });
  } catch (error) {

    // Handle duplicate membership error
    if (error.code === "23505") {
      return res.status(409).json({ message: "user is already a member", id: eventId });
    }

    console.error("Error adding member to event:", error);
    res.status(500).json({ message: "Error adding member to event" });
  }
});


// localhost:3000/events/share
// send emails to share the event 
router.post('/share', authenticate, async (req, res) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const { event_id, email } = req.body;

  if (!event_id || !email) {
    return res.status(400).json({ message: "event_id and email are required" });
  }

  try {
    const eventCheck = await db.query(`
      SELECT id, share_token,name, deadline, description FROM events WHERE id = $1;
    `, [event_id]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    const list_name = eventCheck.rows[0].name;
    const event_date = eventCheck.rows[0].deadline;
    const list_description = eventCheck.rows[0].description;

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
      // User exists, add them to the event

      const memberUserId = userCheck.rows[0].id;
      const toUser = userCheck.rows[0].displayname;

      await db.query(`
        INSERT INTO event_members (user_id, event_id, owner, notifications, dateCreated)
        VALUES ($1, $2, false, true, NOW()) ON CONFLICT DO NOTHING;
      `, [memberUserId, event_id]);

      // send notification, make sure they allow notifications
      if (userCheck.rows[0].notifications) {
        await createNotification([memberUserId], "You've been invited to a event!", `${fromUser} has invited you to the event: ${eventCheck.rows[0].name}`, `/events/${eventCheck.rows[0].id}`);
        await memberAdded(email, toUser, fromUser, list_name, event_date, list_description, `https://wishify.ca/events/${eventCheck.rows[0].id}`);
      }

      return res.status(200).json({ message: "User added to event." });
    } else {
      // else send an email to that user with an invite link 

      const inviteLink = `https://wishify.ca/register?event=${eventCheck.rows[0].share_token}`;

      await memberInvite(email, fromUser, list_name, event_date, list_description, inviteLink);
    }

    return res.status(200).json({ message: "Invitation sent." });
  } catch (error) {
    console.error("Error fetching shared event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



async function memberInvite(to, sender_name, list_name, event_date, list_description, register_link) {
  try {
    let htmlTemplate = await fs.readFile(path.join(__dirname, './emailtemplates/MemberInvite.html'), 'utf8');

    const renderedHtml = mustache.render(htmlTemplate, {
      sender_name,
      list_type: 'Event',
      list_name,
      event_date,
      list_description,
      register_link,
      current_year: new Date().getFullYear()
    });

    await sendEmail(to, `${sender_name} has invited you to collaborate on their Event!`, null, renderedHtml);
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
      list_type: 'Event',
      list_name,
      event_date,
      list_description,
      view_link,
      current_year: new Date().getFullYear()
    });

    await sendEmail(to, `${sender_name} has invited you to collaborate on their Event!`, null, renderedHtml);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}





module.exports = router;