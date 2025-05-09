import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  try {
    // For development, skip authentication and use a mock user
    // In production, this would verify the JWT token and find the user

    // Mock user for development
    req.user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // For development, skip role authorization
    // In production, this would check if the user has the required role
    next();
  };
};
