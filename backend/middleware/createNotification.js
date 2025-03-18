const db = require("../db");

// send a notification to users
async function createNotification(notifications) {

    if (!Array.isArray(notifications) || notifications.length === 0) {
        console.error("No notifications to insert.");
        return;
    }

    // create list of placeholders example: ($1, $2, $3, false), ($4, $5, $6, false), ...
    const values = notifications.map((n, index) =>
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3}, false)`
    ).join(", ");

    // now convert the array input from [[userID1, body1, url1],[userID2, body2, url2]] -> [userID1, body1, url1, userID2, body2, url2]
    const params = notifications.flatMap(n => [n.userID, n.body, n.url]);

    try {
        await db.query(`
        INSERT INTO notifications (user_id, body, url, is_read) 
        VALUES ${values}
        `, params);

        console.log("Notifications added successfully.");
    } catch (error) {
        console.error("Error creating notifications:", error);
    }
}

module.exports = createNotification;

/*
const createNotification = require("./middlewares/createNotification");

const notifications = [
  { userID: 1, body: "User A liked your post", url: "/post/123" },
  { userID: 2, body: "User B commented on your photo", url: "/photo/456" },
  { userID: 3, body: "User C sent you a friend request", url: "/friends" }
];

createNotification(notifications);
*/
