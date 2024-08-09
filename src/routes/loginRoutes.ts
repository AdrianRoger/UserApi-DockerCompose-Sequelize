import { Router } from "express";
import { login, logout } from '../controllers/AuthController';

const loginRouter:Router = Router();


loginRouter.post('/login', login);
loginRouter.delete('/logout', logout);

export default loginRouter;