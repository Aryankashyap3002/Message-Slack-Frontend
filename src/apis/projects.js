import { createFetchConfig } from '@/config/fetchConfig'; 

export const createProjectApi = async (data = {}) => {
  const { baseURL, headers } = createFetchConfig();
  const { workspaceId, ...projectData } = data;
  
  // Make sure baseURL is correctly set
  if (!baseURL) {
    console.error('baseURL is undefined in fetchConfig');
    throw new Error('API base URL is not configured properly');
  }
  
  let url;
  
  // If workspaceId is provided, use the workspace-based endpoint
  if (workspaceId) {
    url = `${baseURL}/workspaces/${workspaceId}/projects`;
  } else {
    url = `${baseURL}/projects`;
  }
  
  try {
    console.log('Sending request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Response received:', responseData);
    return responseData;
  } catch(error) {
    console.log('Error details:', error.message, error.response || 'No response');
    throw error;
  }
}
  
export const getProjectTree = async ({ workspaceId, projectId }) => {
  const { baseURL, headers } = createFetchConfig();
  
  if (!baseURL) {
    console.error('baseURL is undefined in fetchConfig');
    throw new Error('API base URL is not configured properly');
  }
  
  try {
    // Use the new URL format that includes workspaceId
    const url = `${baseURL}/workspaces/${workspaceId}/projects/${projectId}/tree`;
    console.log('Fetching project tree from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Project tree data received:', data);
    return data?.data;
  } catch(error) {
    console.error('Error fetching project tree:', error);
    throw error;
  }
}

export const getAllProjects = async ({ workspaceId }) => {
  const { baseURL, headers } = createFetchConfig();
  
  if (!baseURL) {
    console.error('baseURL is undefined in fetchConfig');
    throw new Error('API base URL is not configured properly');
  }
  
  try {
    // Define the URL based on whether we're fetching all projects or workspace-specific projects
    const url = workspaceId 
      ? `${baseURL}/workspaces/${workspaceId}/projects` 
      : `${baseURL}/projects`;
    
    console.log('Fetching all projects from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Projects data received:', data);
    return data?.data || [];
  } catch(error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}