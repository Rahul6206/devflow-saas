

import express from 'express'
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt'

const signup=async (req:express.Request,res:express.Response)=>{
    const { name, email, password } = req.body;

    try {

        const emailExist= await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(emailExist){
            return res.json({message: "User already exists"})
        }

        const uuid = crypto.randomUUID();
        const hashpassword= await bcrypt.hash(password,10);
        
        const User= await prisma.user.create({
            data: {
                id: uuid,
                email: email,
                password:hashpassword,
                name:name,
            },
        })
        res.status(201).json({ message: "User created successfully", user:{ id: User.id, name: User.name, email: User.email } });
    } catch (error) {
        if(error instanceof Error){console.log(error.message);}
    }


}

export default signup;