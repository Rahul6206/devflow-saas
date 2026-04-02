import API from "./axios";

// Create project
export const createProject = (projectData) => {
  return API.post("/project", projectData);
};

// Get all projects in the org
export const getProjects = () => {
  return API.get("/project");
};

// Get single project
export const getProject = (projectId) => {
  return API.get(`/project/${projectId}`);
};

// Update project
export const updateProject = (projectId, projectData) => {
  return API.patch(`/project/${projectId}`, projectData);
};

// Delete project
export const deleteProject = (projectId) => {
  return API.delete(`/project/${projectId}`);
};
