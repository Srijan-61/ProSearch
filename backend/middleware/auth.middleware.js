import jwt from 'jsonwebtoken';

// Middleware to protect routes using JWT
export function authMiddleware(req, res, next) {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; //  split by space

    // If no token found, deny access
    if (!token) return res.status(403).send('Token Not Found');

    try {
        // Verify token with secret key
        const data = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = data;

        // Proceed to next middleware or route
        next();

    } catch (e) {
        // Token is invalid or expired
        res.status(401).send('Invalid or expired token');
    }
}
