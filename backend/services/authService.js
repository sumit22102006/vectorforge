import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate access and refresh tokens
const generateTokens = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key';
  
  const accessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

export const registerUser = async (email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({ email, password });
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);
  
  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  return {
    _id: user._id,
    email: user.email,
    accessToken,
    refreshToken
  };
};

export const loginUser = async (email, password) => {
  // Find user and explicitly select password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Update refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  return {
    _id: user._id,
    email: user.email,
    accessToken,
    refreshToken
  };
};

export const refreshUserToken = async (token) => {
  if (!token) {
    throw new Error('Refresh token is required');
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key';
  
  try {
    const decoded = jwt.verify(token, refreshSecret);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== token) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens (rotating refresh token is optional but good practice)
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return { message: 'Logged out successfully' };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    _id: user._id,
    email: user.email,
    createdAt: user.createdAt
  };
};
