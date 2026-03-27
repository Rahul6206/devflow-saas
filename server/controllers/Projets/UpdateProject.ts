import express from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../utils/RequestType";

const UpdateProject = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const projectId = req.params.projectId;
  const { name } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ message: "Project ID required" });
  }

  if (!name) {
    return res.status(400).json({ message: "Project name required" });
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

    if (project.orgId !== user.organizationId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { name }
    });

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default UpdateProject;