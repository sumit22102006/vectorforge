import { registerUser, loginUser, refreshUserToken, logoutUser, getUserProfile } from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const data = await registerUser(email, password);
    res.status(201).json(data);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const data = await loginUser(email, password);
    res.status(200).json(data);
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await refreshUserToken(refreshToken);
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const data = await logoutUser(req.user._id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const data = await getUserProfile(req.user._id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
