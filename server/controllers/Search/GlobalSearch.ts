import express from "express";
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

export const globalSearch = async (req: AuthRequest, res: express.Response) => {
  const userId = req.user?.id;
  const q = req.query.q as string;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!q || q.trim().length === 0) {
    return res.status(200).json({ projects: [], tasks: [] });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.organizationId) {
      return res.status(403).json({ message: "User not part of an organization" });
    }

    const orgId = user.organizationId;
    const searchQuery = q.trim();

    // Search Projects parallel to Tasks
    const [projects, tasks] = await Promise.all([
      prisma.project.findMany({
        where: {
          orgId,
          name: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        },
        take: 5,
        select: {
          id: true,
          name: true
        }
      }),
      prisma.task.findMany({
        where: {
          project: {
            orgId
          },
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          projectId: true,
          project: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    return res.status(200).json({ projects, tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Search failed" });
  }
};
