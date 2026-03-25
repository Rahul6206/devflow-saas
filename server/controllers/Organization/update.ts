import express from 'express'
import { AuthRequest } from '../../utils/RequestType';
import { prisma } from '../../lib/prisma';

const UpdateOrg= async(req:AuthRequest,res:express.Response)=>{
    const usrid=req.user.id;
    if(!req.body.name) res.status(401).json({message: "please provide name"})
    if(!usrid) return res.status(401).json({message: "user id not found"})
    try {
        const user= await prisma.user.findUnique({
            where:{
                id: usrid
            }
        })

        if(!user?.id) return res.status(401).json({message:"User not Found"});
        
        if(!user.organizationId) return res.status(401).json({message:"Organization not found"});

        const updateOrg=await prisma.organization.update({
            where: { id: user.organizationId},
            data: {
                name: req.body.name
            }
        })

        res.status(200).json({message: "Organizaion name is updated", name: updateOrg.name})
        
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            return res.status(404).json({ message: error.message })
        }
    }

}

export default UpdateOrg;