
/**
 * a helper function to handle authentication,
 * simply include in endpoint to determine if user is authenticated.
 * automatically sends back 401 access denied errors
 * use const user_id = req.user.id; to get the id of the user
 */

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY); // Remove "Bearer " prefix if present
        req.user = decoded; // Attach user info to the request
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = authenticate;
