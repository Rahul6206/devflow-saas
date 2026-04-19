import express from 'express'
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

const CreateOrganization = async (req: AuthRequest, res: express.Response) => {
    if (req.user.organizationId) {
        return res.status(400).json({ error: "User already in an organization" });
    }
    const orgname = req.body.name;
    if (!orgname) return res.status(400).json({ message: "Please Provide organizaion name" })

    try {

        const org = await prisma.organization.create({
            data: {
                name: orgname
            }
        })

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                organizationId: org.id,
                role: "ADMIN"
            }
        });

        res.status(201).json({
            message: "Organization created", organization: {
                id: org.id,
                name: org.name
            }
        })



    } catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({ message: error.message })
        }
    }


}

export default CreateOrganization;