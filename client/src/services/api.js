export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get stored auth access token
 */
export const getStoredToken = () => {
  return localStorage.getItem('veloop_access_token');
};

/**
 * Centralized API fetch wrapper with Bearer token, JSON response handling, and structured error throwing.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // Non-JSON or empty response body
  }

  if (!response.ok || (data && data.success === false)) {
    const errorMsg = data?.message || `HTTP error! Status: ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = data?.code || (response.status === 401 ? 'UNAUTHORIZED' : response.status === 403 ? 'FORBIDDEN' : 'API_ERROR');
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Health check helper
 */
export const checkHealth = async () => {
  try {
    const data = await apiFetch('/health');
    return data;
  } catch (error) {
    console.error('API health check error:', error);
    return { success: false, message: 'Failed to connect to backend service' };
  }
};
