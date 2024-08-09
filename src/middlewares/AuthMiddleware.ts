import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/interfaces";
import User from "../models/userModel";
import jwt from "jsonwebtoken";

type IAuth = Omit<IUser, 'password'>

declare global {
  namespace Express {
    interface Request {
      authUser: IAuth;
    }
  }
}

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies["sessionid"];

    if (token) {
      const tokenVerify = (await jwt.verify(
        token,
        process.env.SECRET_KEY || ""
      )) as {
        id: string;
      };

      const user = await User.findByPk(tokenVerify.id);

      if (user) {
        const { id, name, email } = user.dataValues as IUser;
        req.authUser = { id, name, email };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
