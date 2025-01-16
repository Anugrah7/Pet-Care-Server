const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside jwtMiddleware");

    try {
        // Check for Authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json("Authorization failed. Token is missing or improperly formatted!");
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json("Authorization failed. Token is missing!");
        }

        // Verify token
        const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
        console.log("JWT Response:", jwtResponse);

        // Attach user ID and role to request object
        req.userId = jwtResponse.userId;
        req.role = jwtResponse.role;

        // Proceed to the next middleware/controller
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(403).json("Authorization failed. Token has expired!");
        }

        return res.status(403).json("Authorization failed. Invalid or expired token!");
    }
};

module.exports = jwtMiddleware;
