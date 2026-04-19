import express from 'express'
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../utils/RequestType.js";

const Orgme= async(req:AuthRequest,res:express.Response)=>{
    const usrid=req.user.id;
    if(!usrid) return res.status(401).json({message: "user id not found"})
    try {
        const orgUserexist=await prisma.user.findUnique({
            where:{
                id: usrid
            }
        })

        if(!orgUserexist) return res.status(401).json({message: "user not exist"});
        if(!orgUserexist.organizationId) return res.status(404).json({message: "Organization not found"});
        const OrgData= await prisma.organization.findUnique({
            where:{
                id: orgUserexist.organizationId
            }
        })
        res.status(200).json({organizationId: OrgData?.id, name: OrgData?.name})
    } catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({ message: error.message })
        }
    }

}

export default Orgme;