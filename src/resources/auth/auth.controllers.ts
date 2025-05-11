import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const prisma = new PrismaClient();

  /**
   * @description 
   * @route POST /auth/login
   */

export async function loginUser(req:Request, res:Response): Promise<void>{
  
    try {
        const { email, password } = req.body;
    
        const user = await prisma.user.findFirst({
          where: { email },
        });
        
    
        if (!user || !await bcrypt.compare(password, user.password)) {
          res.status(401).json({ error: "Invalid username or password" });
          return
        }
  
        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined in environment variables");
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
        res.json({ token, id: user.id });
      } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Login failed!" });
      }
}

