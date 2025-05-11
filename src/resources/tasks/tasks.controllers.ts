import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../../middleware/authMiddleware'

const prisma = new PrismaClient();

/**
 * @description Get all tasks
 * @route GET /tasks
 */

export async function getTasks(req:Request, res: Response): Promise<void> {
  try {
    const todos = await prisma.task.findMany();

    if (!todos.length)
      res.status(404).json({ message: "No tasks found" });
    
      res.status(200).json(todos);
      return;
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @description Get project tasks
 * @route GET /project/:id/tasks
 */

export async function getProjectTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user as JwtPayload;
    const userId = user.id;
    const { id: projectId } = req.params;

    const tasks = await prisma.task.findMany({
      where: {
        authorId: userId,
        projectId: Number(projectId),
      },
    });


    if (!tasks.length) {
      res.status(404).json({ message: "No tasks found for this project" });
      return 
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @description Get specific tasks
 * @route GET /tasks/:id
 */

export async function getSpecificTask(req: Request, res: Response): Promise<void>{
  try {
    const { id: tasksid } = req.params;
    const task = await prisma.task.findUnique({
      where: {
        id: Number(tasksid)
      },
    });

    if (task == null){
      res.status(404).json({ message: "No tasks with this id found." });
      return 
    }
  res.status(200).json(task);

  } catch (error){
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }
}

/**
 * @description Get all user tasks
 * @route GET /users/tasks/
 */

export async function getUserTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user as JwtPayload;
    const userId = user.id;

    const tasks = await prisma.task.findMany({
      where: { authorId: userId },
    });

    if (!tasks.length) {
      res.status(404).json({ message: "No tasks found for this user." });
      return;
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error retrieving user tasks:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

//POST todos
export async function createTask(req: Request, res: Response) {
  try {
    const { title, description, status, finishedBy, authorId } = req.body;

    const newTodo = await prisma.task.create({
      data: {
        title,
        description,
        status,
        authorId,
      },
    });

    res
      .status(201)
      .json({ id: newTodo.id, message: "Todo created!", title: newTodo.title, status: newTodo.status, authorId: newTodo.authorId });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  } finally {
    await prisma.$disconnect();
  }
}

//Delete todo
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      res.status(400).json({ error: "Invalid ID parameter!" });
      return;
    }

    const deletedTodo = await prisma.task.delete({
      where: { id: Number(id) }, 
    });

    if (!deletedTodo) {
      res.status(404).json({ error: "Todo not found!" });
      return;
    }

    res.status(200).json({ message: "Todo deleted!", todo: deletedTodo });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }
}

//Update todo
export async function updateTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTodo = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
      },
    });

    res.status(200).json({ message: "Todo updated!", todo: updatedTodo });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  } finally {
    await prisma.$disconnect();
  }
}

//Update only status of todo
export async function updatePartialTask(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTodo = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.status(200).json({ message: "Status updated!", todo: updatedTodo });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  } finally {
    await prisma.$disconnect();
  }
}