import { ILoginRequestDTO, IUser } from "../interfaces/interfaces";
import User from "../models/userModel";
import { EmailOrPasswordIncorrectException } from "../utils/Exception";
import { Message } from "../utils/Message";
import { comparePassword } from "../utils/passwordUtil";
import jwt from "jsonwebtoken";

export const loginService = async (
  login: ILoginRequestDTO
): Promise<string> => {
  const { email } = login;
  const data = await User.findOne({ where: { email } });
  const user = data?.dataValues;

  if (!user) {
    throw new EmailOrPasswordIncorrectException(
      Message.EMAIL_OR_PASSWORD_INCORRECT
    );
  }

  if (!(await comparePassword(login.password, user.password))) {
    throw new EmailOrPasswordIncorrectException(
      Message.EMAIL_OR_PASSWORD_INCORRECT
    );
  }

  const token = await jwt.sign(
    { id: user.id },
    process.env.SECRET_KEY || "vaqueda"
  );

  return token;
};
