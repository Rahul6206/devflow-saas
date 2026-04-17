import express from "express";
import { prisma } from "../../lib/prisma";
import sendEmail from "../../utils/sendEmail";

const sendOtp = async (req: express.Request, res: express.Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Generate a 6 digit random number
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Clean up any existing active OTPs for this email to prevent spam
    await prisma.oTP.deleteMany({
      where: { email },
    });

    // 3. Save new OTP to database (expires in 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.oTP.create({
      data: {
        email,
        token: otpCode, // In a production env, you might want to bcrypt this if it was a longer token, but a short-lived 6 digit code over HTTPS is generally fine in plaintext for quick matching
        expiresAt,
      },
    });

    // 4. Send Email
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #6C63FF; text-align: center;">Welcome to DevFlow, ${name}!</h2>
        <p style="font-size: 16px; color: #333;">You are almost done setting up your workspace. Please use the following One-Time Password (OTP) to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; background-color: #6C63FF; color: white; padding: 10px 20px; border-radius: 8px; letter-spacing: 4px;">${otpCode}</span>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in 15 minutes.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this, please safely ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email,
      subject: "DevFlow - Registration Verification Code",
      message,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default sendOtp;
