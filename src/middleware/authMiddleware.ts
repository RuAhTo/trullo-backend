import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

dotenv.config();
export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload; 
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  console.log('Authorization header:', authHeader);
  console.log('Token:', token);

  if (!token) {
    res.status(403).send('Access denied');
    return
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
       res.status(403).send('Invalid token');
       return
    }
    req.user = user;
    next();
  });
}