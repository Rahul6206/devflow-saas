import express from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

const AssignTask = async (req: AuthRequest, res: express.Response) => {
  const currentUserId = req.user?.id;
  const taskId = req.params.taskId;
  const { userId } = req.body;

  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!taskId || typeof taskId !== "string") {
    return res.status(400).json({ message: "Task ID required" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.organizationId) {
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

    // 🔐 TASK ORG CHECK
    if (task.project.orgId !== currentUser.organizationId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // 🔐 USER ORG CHECK
    if (targetUser.organizationId !== currentUser.organizationId) {
      return res.status(403).json({ message: "User not in your organization" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedTo: targetUser.id
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create Notification for the assigned user
    if (targetUser.id !== currentUserId) {
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          message: "A task has been assigned to you.",
          taskId: taskId
        }
      });
    }

    return res.status(200).json({
      message: "Task assigned successfully",
      task: updatedTask
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default AssignTask;