import { Request, Response, NextFunction } from "express";
import { Message } from "../utils/Message";
import { EmailOrPasswordIncorrectException } from "../utils/Exception";
import { ILoginRequestDTO } from "../interfaces/interfaces";
import { loginService } from "../Services/AuthService";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const login: ILoginRequestDTO = req.body;
    if (!login) {
      throw new EmailOrPasswordIncorrectException(
        Message.EMAIL_OR_PASSWORD_INCORRECT
      );
    }

    const token = await loginService(login);

    res.cookie("sessionid", token, { maxAge: 30 * 60 * 1000, httpOnly: true })

    res.status(200).json({message: Message.LOGIN_SUCCESS})
  } catch (error) {
    next(error);
  }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {  
      res.clearCookie("sessionid");
  
      res.status(200).json({ message: Message.LOGOUT_SUCCESS });
    } catch (error) {
      next(error);
    }
  }