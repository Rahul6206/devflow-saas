import { prisma } from "../../lib/prisma.js";
export const markNotificationsRead = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: { isRead: true }
        });
        return res.status(200).json({ message: "Notifications marked as read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update notifications" });
    }
};
