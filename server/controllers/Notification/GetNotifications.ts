import express from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";

export const getNotifications = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
