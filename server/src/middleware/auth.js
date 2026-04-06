// TODO: Implement Authentication Middleware
// Verify JWT token from request headers
// Attach user info to req.user
// Allow only authenticated requests to continue

import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    // Get token from headers (Authorization: Bearer <token>)
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Optional auth middleware
// For endpoints that work with or without authentication
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      // Verify and attach user if token provided
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // If token is invalid but not required, just continue
    next();
  }
};
