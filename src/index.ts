import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/userRoutes";
import loginRouter from "./routes/loginRoutes";
import { ErrorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import AuthMiddleware from './middlewares/AuthMiddleware';
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();
const port: number = Number(process.env.PORT);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(AuthMiddleware);

app.get("/test", (req: Request, res: Response) => {
  res.send("Cuidado com a sequelize");
});

app.use("/users", userRouter);
app.use('/', loginRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use(ErrorHandlerMiddleware);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
