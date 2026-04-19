import express from "express";
import { getNotifications } from "../controllers/Notification/GetNotifications.js";
import { markNotificationsRead } from "../controllers/Notification/MarkAsRead.js";
import authenticateToken from "../middlewares/authToken.js";

const router = express.Router();

router.get("/", authenticateToken, getNotifications);
router.patch("/read", authenticateToken, markNotificationsRead);

export default router;
