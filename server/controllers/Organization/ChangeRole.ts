import express from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";
import { Role } from "../../generated/prisma/enums";

const ChangeMemberRole = async (req: AuthRequest, res: express.Response) => {
  const currentUserId = req.user?.id;
  const targetUserId = req.params.userId as string;
  const { role } = req?.body as { role?: Role };

  if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });
  if (!targetUserId) return res.status(400).json({ message: "User id is required" });
  if (!role) return res.status(400).json({ message: "Role is required" });

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) return res.status(404).json({ message: "Current user not found" });
    if (currentUser.role !== "ADMIN") return res.status(403).json({ message: "Only admin can change roles" });
    if (!currentUser.organizationId) return res.status(400).json({ message: "No organization" });

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) return res.status(404).json({ message: "Target user not found" });
    if (targetUser.organizationId !== currentUser.organizationId) {
      return res.status(403).json({ message: "User not in your organization" });
    }

    // 🔥 LAST ADMIN PROTECTION
    if (targetUser.role === "ADMIN" && role === "MEMBER") {
      const adminCount = await prisma.user.count({
        where: {
          organizationId: currentUser.organizationId,
          role: "ADMIN"
        }
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Cannot demote the last admin"
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    return res.status(200).json({
      message: "Role updated successfully",
      user: updatedUser
    });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default ChangeMemberRole;