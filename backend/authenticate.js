const jwt = require("jsonwebtoken");
const db = require('./db');
require("dotenv").config(); // Load environment variables

/**
 * a helper function to handle authentication,
 * simply include in endpoint to determine if user is authenticated.
 * automatically sends back 401 access denied errors
 * use const user_id = req.user.userid; to get the id of the user
 */

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Find the user associated with the token
        const session = await db.query("SELECT user_id FROM sessions WHERE token = $1", [token]);

        if (session.rows.length === 0) {
            return res.status(401).json({ message: "User not logged in" });
        }
        
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY); // Remove "Bearer " prefix if present
        req.user = decoded; // Attach user info to the request
        next(); // Continue to the next middleware or route handler
    } catch (error) {

        try {
            // delete the invalid session, so when users come back it will be removed over time
            await db.query("DELETE FROM sessions WHERE token = $1", [token]);
        } catch (dbError) {
            console.error("Failed to delete invalid session:", dbError.message);
        }

        res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = authenticate;
