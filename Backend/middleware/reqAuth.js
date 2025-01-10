import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const reqAuth = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET);

        // Attach the decoded user information (e.g., user id) to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid.' });
    }
};

export default reqAuth;
