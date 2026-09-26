/**
Helper to dynamically resolve and normalize API base URL
*/
export const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  
  if (!url) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      url = '/api';
    } else {
      url = 'http://localhost:5000/api';
    }
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure path ends with /api if not already present
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }

  return url;
};

export const API_BASE_URL = getBaseUrl();

/**
 * Get stored auth access token
 */
export const getStoredToken = () => {
  return localStorage.getItem('veloop_access_token');
};

/**
 * Centralized API fetch wrapper with Bearer token, JSON response handling, network failure catching, and structured error throwing.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (netErr) {
    const error = new Error("We couldn't connect to the rewards server. Please ensure the backend API service is running and reachable.");
    error.code = 'CONNECTION_ERROR';
    error.originalError = netErr;
    throw error;
  }

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
    return { success: false, message: error.message || 'Failed to connect to backend service' };
  }
};
