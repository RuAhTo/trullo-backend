import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();
const prisma = new PrismaClient();

/**
 * @description Get all users
 * @route GET /users
 */

export async function getUsers(req: Request, res:Response): Promise<void> {
    try {
        const users = await prisma.user.findMany();

        if(!users.length){
            res.status(404).json({message: 'No users found.'})
            return
        }

        res.status(200).json({users});
    } catch (error){
        console.error('Error details:', error)
        res.status(500).json({ error: 'Database query failed.', details: error });
    }
}

/**
 * @description Get user
 * @route GET /users/:id
 */

export async function getUser(req:Request, res:Response): Promise<void> {
    const {id} = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ message: 'Invalid user ID.' });
        return
    }
    
    
    try {
        const user = await prisma.user.findUnique({
            where: {id: Number(id)}
        })


        if(!user){
            res.status(404).json({message: 'User not found.'})
            return
        }

        res.status(200).json(user)
        return
    } catch(error){
        console.error('Error details', error)
        res.status(500).json({message: 'Database query failed.'})
    }
}

/**
 * @description Create new user
 * @route POST /users
 */

export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const { username, password, email, name } = req.body;

        if (!username || !password || !email || !name) {
            res.status(400).json({ message: 'All fields are required.' });
            return
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        const existingUsername = await prisma.user.findUnique({
            where: { username: username }
        });

        if (existingEmail) {
            res.status(400).json({ message: 'User with this email already exists' });
            return
        }
        if (existingUsername) {
            res.status(400).json({ message: 'This username is already in use' });
            return
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                name: name,
                email: email,
            }
        });

        res.status(201).json({ id: newUser.id, message: 'User created!', username: newUser.username });
        return
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Database query failed.', details: error });
        return
    }
}

/**
 * @description Update user
 * @route PUT /users
 */

export async function updateUser(req: AuthenticatedRequest, res: Response) {
    try {
        const user = req.user as JwtPayload;
        const userId = user.id;

        const { username, password, email, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
            username,
            password: hashedPassword,
            email,
            name,
            },
        });
  
      res.status(200).json({ message: "User updated!", user: updatedUser });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({ error: "Database query failed!" });
    }
  }
  
  /**
   * @description Delete user
   * @route DELETE /users
   */

  export async function deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
        const user = req.user as JwtPayload;
        const userId = user.id;
  
        const deletedUser = await prisma.user.delete({
            where: { id: Number(userId) },
        });
    
        res.status(200).json({ message: "User deleted!", user: deletedUser });
    } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
    }
  }