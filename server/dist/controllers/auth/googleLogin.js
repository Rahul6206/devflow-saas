import { OAuth2Client } from "google-auth-library";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "No credential provided" });
        }
        // Verify token with Google mathematically
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            return res.status(400).json({ message: "Invalid Google token payload" });
        }
        const { email, name } = payload;
        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // Auto-create user if they don't exist (Signup flow via Google)
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    authProvider: "google",
                },
            });
        }
        // Assign JWT Tokens for standard DevFlow session
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: (process.env.JWT_LIFETIME || "15m") });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: (process.env.JWT_REFRESH_LIFETIME || "7d") });
        // Save refresh token to DB
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Failed to authenticate with Google." });
    }
};
