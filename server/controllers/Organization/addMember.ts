
import express from 'express'
import { AuthRequest } from '../../utils/RequestType';
import { prisma } from '../../lib/prisma';

const AddMember = async (req: AuthRequest, res: express.Response) => {
    const usrid = req.user.id;
    const membermail = req.body.email
    if (!membermail) { return res.status(400).json({ message: "Please provide member email" }) }
    if (!usrid) return res.status(401).json({ message: "user id not found" })
    const currentuser = await prisma.user.findUnique({
        where: {
            id: usrid
        }
    })
    if (!currentuser) { return res.status(404).json({ message: "user not found" }) }

    if (currentuser.role !== "ADMIN") { return res.status(401) }

    try {
        const userexist = await prisma.user.findUnique({
            where: {
                email: membermail
            }
        })

        if (!userexist) { return res.status(404).json({ message: "email not found" }) }
        if (userexist.role == "ADMIN") { return res.status(400).json({ message: `You cannot add a Organizaiton because this email ${membermail} is already a ADMIN to another Organization`}) }

        if (userexist.organizationId) {
            return res.status(400).json({ error: "User already in an organization" });
        }

        const updateuser=await prisma.user.update({
            where: {
                email: membermail
            },
            data: {
                organizationId: currentuser.organizationId,
            }
        })

        res.status(201).json({message: "new memberadded successfully", member:{name:updateuser.name, email: updateuser.email}})


    } catch (error) {
if (error instanceof Error) {
            return res.status(404).json({ message: error.message })
        }
    }

}

export default AddMember;