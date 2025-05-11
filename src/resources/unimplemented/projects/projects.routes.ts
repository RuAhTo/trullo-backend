import express from 'express'
import { createProject, getUserProjects } from './projects.controllers'

const router = express.Router();

router.get('/users/:id/projects', getUserProjects);
router.post('/users/:id/projects', createProject);

export default router