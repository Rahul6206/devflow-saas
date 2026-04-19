import { prisma } from "../../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const Login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    });
    if (!user)
        return res.status(400).json({ error: "Cannot find user" });
    if (!user.password)
        return res.status(400).json({ error: "Cannot find user" });
    try {
        const isvalidPassword = await bcrypt.compare(req.body.password, user.password);
        if (isvalidPassword) {
            const payload = { id: user.id, email: user.email };
            const accesstoken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            const Reftestoken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "5d" });
            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: Reftestoken }
            });
            // res.json({ accessToken: accesstoken, refreshToken: Reftestoken, id: user.id });
            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    organizationId: user.organizationId,
                }, accessToken: accesstoken, refreshToken: Reftestoken
            });
        }
        else {
            res.status(401).json({ error: "Not Allowed - Incorrect Password" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
};
export default Login;
