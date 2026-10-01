const authService = require('../services/authService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Helper to set secure refresh token cookie
 */
const setAuthCookies = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({ name, email, password });

    setAuthCookies(res, result.refreshToken);

    return successResponse(
      res,
      {
        user: result.user,
        accessToken: result.accessToken
      },
      'Account created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    setAuthCookies(res, result.refreshToken);

    return successResponse(
      res,
      {
        user: result.user,
        accessToken: result.accessToken
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const me = async (req, res, next) => {
  try {
    const userProfile = await authService.getCurrentUser(req.user._id);

    return successResponse(
      res,
      { user: userProfile },
      'Current user profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatarUrl } = req.body;
    const updatedUser = await authService.updateUserProfile(req.user._id, { name, avatarUrl });
    return successResponse(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
  updateProfile,
  logout
};
