import express from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";

const CreateTask = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const { title, description, projectId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
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

    // 🔐 ORG SECURITY
    if (project.orgId !== user.organizationId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId
      }
    });

    return res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default CreateTask;