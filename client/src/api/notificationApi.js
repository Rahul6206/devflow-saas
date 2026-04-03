import api from "./axios";

export const getNotifications = () => {
  return api.get("/notifications");
};

export const markNotificationsRead = () => {
  return api.patch("/notifications/read");
};
