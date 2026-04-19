import express from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

const GetSingleTask = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const taskId = req.params.taskId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!taskId || typeof taskId !== "string") {
    return res.status(400).json({ message: "Task ID required" });
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

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project.orgId !== user.organizationId) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default GetSingleTask;