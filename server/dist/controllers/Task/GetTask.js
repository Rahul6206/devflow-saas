import { prisma } from "../../lib/prisma.js";
const GetTasks = async (req, res) => {
    const userId = req.user?.id;
    const projectId = req.query.projectId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!projectId) {
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
        if (project.orgId !== user.organizationId) {
            return res.status(403).json({ message: "Access denied" });
        }
        const tasks = await prisma.task.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
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
        return res.status(200).json({ tasks });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export default GetTasks;
