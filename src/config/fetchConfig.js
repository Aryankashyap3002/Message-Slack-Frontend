export const createFetchConfig = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
  
  // Get auth token from localStorage
  const token = localStorage.getItem('token');
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Use the correct header name - x-access-token instead of Authorization
  if (token) {
    headers['x-access-token'] = token; // Remove 'Bearer ' prefix and use correct header name
  }
  
  return {
    baseURL,
    headers
  };
};