import API from "./axios";

// Create task
export const createTask = (taskData) => {
  return API.post("/task", taskData);
};

// Get tasks (optionally filter by projectId)
export const getTasks = (projectId) => {
  const params = projectId ? { projectId } : {};
  return API.get("/task", { params });
};

// Get single task details
export const getTask = (taskId) => {
  return API.get(`/task/${taskId}`);
};

// Update task
export const updateTask = (taskId, taskData) => {
  return API.patch(`/task/${taskId}`, taskData);
};

// Delete task
export const deleteTask = (taskId) => {
  return API.delete(`/task/${taskId}`);
};

// Assign task to a user
export const assignTask = (taskId, userId) => {
  return API.patch(`/task/${taskId}/assign`, { userId });
};

// Update task status (TODO, IN_PROGRESS, DONE)
export const updateTaskStatus = (taskId, status) => {
  return API.patch(`/task/${taskId}/status`, { status });
};

// Add a comment to a task
export const addComment = (taskId, text) => {
  return API.post(`/task/${taskId}/comments`, { text });
};

// Get comments for a task
export const getComments = (taskId) => {
  return API.get(`/task/${taskId}/comments`);
};
