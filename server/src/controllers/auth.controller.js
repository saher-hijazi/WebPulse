import { User } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Mock registration for development
    // In a real app, this would check if the user exists and create a new user

    // Mock user
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: name || 'Test User',
      email: email || 'test@example.com',
      role: 'user',
      generateToken: () => 'mock_jwt_token_for_development'
    };

    // Generate token
    const token = mockUser.generateToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Mock user for development
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      generateToken: () => 'mock_jwt_token_for_development'
    };

    // Check if credentials match mock user
    if (email === 'test@example.com' && password === 'password123') {
      // Generate token
      const token = mockUser.generateToken();

      res.status(200).json({
        success: true,
        token,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res, next) => {
  try {
    // Mock user for development
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    res.status(200).json({
      success: true,
      data: mockUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/me
 * @access Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Mock user update for development
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: name || 'Test User',
      email: email || 'test@example.com',
      role: 'user',
    };

    res.status(200).json({
      success: true,
      data: mockUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update password
 * @route PUT /api/auth/password
 * @access Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password',
      });
    }

    // Mock password update for development
    // In a real app, this would verify the current password and update to the new one

    // Mock token
    const token = 'mock_jwt_token_for_development';

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
