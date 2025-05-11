import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './resources/users/users.routes';
import projectsRouter from './resources/unimplemented/projects/projects.routes';
import authRouter from './resources/auth/auth.routes';
import tasksRouter from './resources/tasks/tasks.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/trullodb', usersRouter);
app.use('/trullodb', projectsRouter);
app.use('/trullodb', authRouter);
app.use('/trullodb', tasksRouter);

export default app;
