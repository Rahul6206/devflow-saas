import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

const Logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    // find user first
    const user = await prisma.user.findFirst({
      where: { refreshToken }
    });

    if (!user) {
      return res.sendStatus(204); // already logged out
    }

    // remove token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null }
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};

export default Logout;