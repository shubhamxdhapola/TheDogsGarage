import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const secret = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid or corrupted token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_the_dogs_garage_2024_secure_token_key_pet_store';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Optional auth silently fails
  }
  next();
};
