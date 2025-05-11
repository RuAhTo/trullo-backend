import express from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser } from './users.controllers'
import { verifyToken } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.post('/users', createUser);
router.put('/users', verifyToken, updateUser);
router.delete('/users', verifyToken, deleteUser);

export default router