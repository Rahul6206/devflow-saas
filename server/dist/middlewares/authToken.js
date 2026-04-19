import jwt from 'jsonwebtoken';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
    if (!token)
        return res.sendStatus(401); // Unauthorized
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ message: error.message });
        }
    }
    next();
};
export default authenticateToken;
