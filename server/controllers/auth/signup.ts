

import express from 'express'
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt'

const signup = async (req: express.Request, res: express.Response) => {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
        return res.status(400).json({ error: "Missing required fields, including OTP" });
    }

    try {
        const emailExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (emailExist) {
            return res.json({ message: "User already exists" })
        }

        // Verify OTP
        const otpRecord = await prisma.oTP.findFirst({
            where: { email, token: otp },
        });

        if (!otpRecord) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: "OTP has expired" });
        }

        // OTP is valid, proceed with user creation
        const uuid = crypto.randomUUID();
        const hashpassword = await bcrypt.hash(password, 10);
        
        const User = await prisma.user.create({
            data: {
                id: uuid,
                email: email,
                password: hashpassword,
                name: name,
            },
        })

        // Clean up OTP so it can't be reused
        await prisma.oTP.delete({
            where: { id: otpRecord.id }
        });

        res.status(201).json({ message: "User created successfully", user: { id: User.id, name: User.name, email: User.email } });
    } catch (error) {
        if (error instanceof Error) { console.log(error.message); res.status(500).json({ error: error.message }); }
    }
}

export default signup;