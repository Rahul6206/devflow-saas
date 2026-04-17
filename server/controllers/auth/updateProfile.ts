import express from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";

export const updateProfile = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true
      }
    });

    return res.status(200).json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
