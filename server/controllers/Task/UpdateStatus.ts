import express from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";

const UpdateTaskStatus = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const taskId = req.params.taskId;
  const { status } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!taskId || typeof taskId !== "string") {
    return res.status(400).json({ message: "Task ID required" });
  }

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
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
        project: true
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 ORG SECURITY
    if (task.project.orgId !== user.organizationId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status
      }
    });

    return res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default UpdateTaskStatus;