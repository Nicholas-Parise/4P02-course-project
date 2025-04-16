const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./middleware/authenticate');


// localhost:3000/notifications?page=1&pageSize=10
// get all your notifications
router.get('/', authenticate, async (req, res, next) => {
  const userId = req.user.userId; // Get user ID from authenticated token
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {

    const result = await db.query(`SELECT id, title, body, url, is_read, created FROM notifications WHERE user_id = $1;`, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "notifications not found." });
    }

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/notifications/0
// edit a notifications
router.put('/:id', authenticate, async (req, res, next) => {

  const notificationId = parseInt(req.params.id);
  const { is_read } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token

  // Type checking
  if (is_read !== undefined && typeof is_read !== "boolean") {
    return res.status(400).json({ error: "is_read must be a boolean (true or false)" });
  }

  try {
    /// make sure that only the user that owns the notifications can edit it.
    const ownershipCheck = await db.query(
      `SELECT * FROM notifications WHERE id = $1 AND user_id = $2;`,
      [notificationId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to edit this notification" });
    }

    // Update the notifications with provided values
    const result = await db.query(`
        UPDATE notifications
        SET 
            is_read = COALESCE($1, is_read)
        WHERE id = $2
        RETURNING id, body, url, is_read, created;
      `, [is_read, notificationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "notification not found." });
    }

    res.status(200).json({ message: "notification updated successfully."});


  } catch (error) {
    console.error("Error editing notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/notifications/0
// delte a notifications
router.delete('/:id', authenticate, async (req, res, next) => {

  const notificationId = parseInt(req.params.id);
  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    /// make sure that only the user that owns the notifications can delete it.
    const ownershipCheck = await db.query(
      `SELECT * FROM notifications WHERE id = $1 AND user_id = $2;`,
      [notificationId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have permission to delete this notification" });
    }

    // delete the notifications with provided values
    await db.query(`DELETE FROM notifications WHERE id = $1;`, [notificationId]);


    res.status(200).json({ message: "notification deleted successfully."});
  } catch (error) {
    console.error("Error deleted contribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


module.exports = router;
