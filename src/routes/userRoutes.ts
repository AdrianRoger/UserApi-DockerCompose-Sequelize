import { Router } from "express";
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/usersController';

const userRouter:Router = Router();

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;