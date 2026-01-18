/**
 * API Service
 * 
 * Centralized API configuration and request functions
 * Handles all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API Request URL:', url); // DEBUG LOG
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'An error occurred');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    // Re-throw if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }
    // Fallback for other errors
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

/**
 * Auth API functions
 */
export const authAPI = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role ('employee' or 'recruiter')
   * @returns {Promise} User data with email and role
   */
  login: async (email, password, role) => {
    // Map 'recruiter' to 'employer' for backend compatibility
    const backendRole = role === 'recruiter' ? 'employer' : role;
    
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password, role: backendRole },
    });
  },

  /**
   * Signup new user
   * @param {string} name - User full name
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role ('employee' or 'recruiter')
   * @returns {Promise} User data with email and role
   */
  signup: async (name, email, password, role) => {
    // Map 'recruiter' to 'employer' for backend compatibility
    const backendRole = role === 'recruiter' ? 'employer' : role;
    
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: { name, email, password, role: backendRole },
    });
  },
};

export default apiRequest;
