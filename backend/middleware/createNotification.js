const db = require("../db");

// send a notification to users
//async function createNotification(userIDs, title, body, url) {

const createNotification = async (userIDs, title, body, url) => {
    if (!Array.isArray(userIDs) || userIDs.length === 0) {
        console.error("No userIDs to send.");
        return;
    }

    // Generate placeholders only for user_id dynamically ($1, $n+1, $n+2, $n+3, false), ($2, $n+1, $n+2, $n+3, false), ...
    const values = userIDs
        .map((_, index) => `($${index + 1}, $${userIDs.length + 1}, $${userIDs.length + 2}, $${userIDs.length + 3}, false)`)
        .join(", ");

    // now convert the array input from [[userID1,userID2], title, body, url], -> [userID1, userID2, title, body, url]
    const params = [...userIDs, title, body, url];

    try {
        await db.query(`
        INSERT INTO notifications (user_id, title, body, url, is_read) 
        VALUES ${values}
        `, params);

        console.log("Notifications added successfully.");
    } catch (error) {
        console.error("Error creating notifications:", error);
    }
};

module.exports = createNotification;

/*
const createNotification = require("./middleware/createNotification");

await createNotification([1,2,3],"title", "body", "link");
*/
