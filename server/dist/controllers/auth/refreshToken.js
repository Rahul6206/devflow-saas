import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
const Refresh = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.status(401).send();
    }
    const user = await prisma.user.findFirst({ where: { refreshToken: refreshToken } });
    if (!user)
        return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err)
            return res.sendStatus(403);
        // Issue a new access token
        const newAccessToken = jwt.sign({ id: payload.id, email: payload.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    });
};
export default Refresh;
