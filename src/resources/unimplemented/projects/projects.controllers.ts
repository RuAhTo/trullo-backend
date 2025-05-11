import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';

const prisma = new PrismaClient();

/**
 * @description Get all projects for a specific user
 * @route GET /users/:id/projects
 */

export async function getUserProjects(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ message: 'Invalid user ID.' });
        return;
    }
    
    try {
        const projects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId: Number(id)
                    }
                }
            },
            include: {
                members: true,
                tasks: true,
            }
        });

        if (!projects.length) {
            res.status(404).json({ message: 'No projects found for this user.' });
            return;
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Database query failed.', details: error });
    }
}


/**
 * @description Create a new project
 * @route POST /users/:id/projects
 */
export async function createProject(req: Request, res: Response): Promise<void> {
    const { id } = req.params; 
    
    // Validera användar-ID
    if (isNaN(Number(id))) {
        res.status(400).json({ message: 'Invalid user ID.' });
        return;
    }

    const { title } = req.body;

    if (!title) {
        res.status(400).json({ message: 'Title is required.' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const project = await prisma.project.create({
            data: {
                title,
                tasks: {
                    create: [] 
                }
            }
        });

        await prisma.projectMember.create({
            data: {
                role: 'ADMIN',
                user: { connect: { id: user.id } },
                project: { connect: { id: project.id } }
            }
        });

        res.status(201).json({ message: 'Project created!', project });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Database query failed.', details: error });
    }
}



