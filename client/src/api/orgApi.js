import API from "./axios";

// Create organization
export const createOrg = (orgData) => {
  return API.post("/org", orgData);
};

// Get current user's organization
export const getMyOrg = () => {
  return API.get("/org/me");
};

// Update organization
export const updateOrg = (orgData) => {
  return API.patch("/org", orgData);
};

// Delete organization
export const deleteOrg = () => {
  return API.delete("/org");
};

// Add member to organization
export const addMember = (memberData) => {
  return API.post("/org/member", memberData);
};

// Get all organization members
export const getOrgMembers = () => {
  return API.get("/org/member");
};

// Remove member from organization
export const removeMember = (userId) => {
  return API.delete(`/org/member/${userId}`);
};

// Change member role
export const changeMemberRole = (userId, roleData) => {
  return API.patch(`/org/member/${userId}/role`, roleData);
};
