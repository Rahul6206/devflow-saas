import express from "express";
import { AuthRequest } from "../../utils/RequestType";
import { prisma } from "../../lib/prisma";

const RemoveMember = async (req: AuthRequest, res: express.Response) => {
  const currentUserId = req.user?.id;
  const targetUserId = req.params.userId;

  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!targetUserId || Array.isArray(targetUserId)) {
    return res.status(400).json({ message: "Please provide userId to remove user" });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    if (currentUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    if (!currentUser.organizationId) {
      return res.status(400).json({ message: "You are not in any organization" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (targetUser.organizationId !== currentUser.organizationId) {
      return res.status(403).json({ message: "User is not in your organization" });
    }

    if (targetUser.id === currentUser.id) {
      return res.status(400).json({ message: "Admin cannot remove self from here" });
    }

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        organizationId: null,
        role: "MEMBER"
      }
    });

    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default RemoveMember;