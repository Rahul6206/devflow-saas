import jwt from 'jsonwebtoken'
import express from 'express'
import { AuthRequest } from '../utils/RequestType.js';

const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
   

    if (!token) return res.sendStatus(401); // Unauthorized



    try {
        
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
           
            req.user = decoded;
        
           
           
            
        
        } catch (error) {
             if(error instanceof Error){
                
              return  res.status(401).json({message: error.message})
            }
        }
        
        next();


};

export default authenticateToken;