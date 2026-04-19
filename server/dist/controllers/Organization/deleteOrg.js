import { prisma } from "../../lib/prisma.js";
const DeleteOrg = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
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
        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Only admin can delete organization" });
        }
        // 🔥 TRANSACTION (IMPORTANT)
        await prisma.$transaction([
            prisma.user.updateMany({
                where: { organizationId: user.organizationId },
                data: {
                    organizationId: null,
                    role: "MEMBER"
                }
            }),
            prisma.organization.delete({
                where: { id: user.organizationId }
            })
        ]);
        return res.status(200).json({
            message: "Organization deleted successfully"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export default DeleteOrg;
