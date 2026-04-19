import { prisma } from "../../lib/prisma.js";
const CreateProject = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Project name is required" });
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
        const project = await prisma.project.create({
            data: {
                name,
                orgId: user.organizationId
            }
        });
        return res.status(201).json({
            message: "Project created successfully",
            project
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export default CreateProject;
