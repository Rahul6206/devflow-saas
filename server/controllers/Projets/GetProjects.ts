import express from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

const GetProjects = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.organizationId) {
      return res.status(400).json({ message: "User not in any organization" });
    }

    const projects = await prisma.project.findMany({
      where: {
        orgId: user.organizationId
      },
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({ projects });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default GetProjects;