import express from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

const GetSingleProject = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const projectId = req.params.projectId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ message: "Project ID required" });
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

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔐 SECURITY CHECK
    if (project.orgId !== user.organizationId) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ project });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default GetSingleProject;