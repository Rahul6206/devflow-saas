import { prisma } from "../../lib/prisma.js";
// POST /tasks/:taskId/comments
export const createComment = async (req, res) => {
    const userId = req.user?.id;
    const { taskId } = req.params;
    const { text } = req.body;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!text || text.trim().length === 0)
        return res.status(400).json({ message: "Comment cannot be empty" });
    try {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        const comment = await prisma.comment.create({
            data: {
                text: text.trim(),
                taskId: taskId,
                userId
            },
            include: {
                user: { select: { name: true, email: true } }
            }
        });
        return res.status(201).json({ comment });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create comment" });
    }
};
// GET /tasks/:taskId/comments
export const getComments = async (req, res) => {
    const userId = req.user?.id;
    const { taskId } = req.params;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const comments = await prisma.comment.findMany({
            where: { taskId: taskId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { id: true, name: true } }
            }
        });
        return res.status(200).json({ comments });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
};
