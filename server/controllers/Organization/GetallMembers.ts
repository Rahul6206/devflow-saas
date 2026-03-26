import express from 'express'
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";

const GetOrgMembers = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.organizationId) {
      return res.status(400).json({ message: "User not in any organization" });
    }

    // 🔥 MAIN LOGIC
    const members = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ members });

  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export default GetOrgMembers;