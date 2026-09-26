import { apiFetch, getStoredToken } from './api';

export { getStoredToken };

/**
 * Store auth access token
 */
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('veloop_access_token', token);
  } else {
    localStorage.removeItem('veloop_access_token');
  }
};

/**
 * User Registration API Request
 */
export const registerApi = async ({ name, email, password }) => {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });

  if (data.data?.accessToken) {
    setStoredToken(data.data.accessToken);
  }

  return data.data;
};

/**
 * User Login API Request
 */
export const loginApi = async ({ email, password }) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (data.data?.accessToken) {
    setStoredToken(data.data.accessToken);
  }

  return data.data;
};

/**
 * Fetch Current Authenticated User API Request
 */
export const getCurrentUserApi = async () => {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const data = await apiFetch('/auth/me', { method: 'GET' });
    return data.data.user;
  } catch (err) {
    setStoredToken(null);
    return null;
  }
};

/**
 * Logout User API Request
 */
export const logoutApi = async () => {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (err) {
    // Ignore network errors during logout
  } finally {
    setStoredToken(null);
  }
};
