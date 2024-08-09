import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { hashPassword } from "../utils/passwordUtil";
import { IUserResponseDTO } from "../interfaces/interfaces";
import AuthorizationNeed from "../utils/AuthorizationNeed";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from "../utils/Exception";
import { Message } from "../utils/Message";
import { json } from "sequelize";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await User.findAll();

    const users: IUserResponseDTO[] = result.map((user) => {
      const sanitized = {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
      };

      return sanitized;
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!password || password.length < 6) {
      throw new BadRequestException(Message.PASSWORD_LENGTH);
    }

    const hashedPW = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPW,
    });

    const response = {
      id: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const updates = req.body;

  try {
    if (isNaN(Number(id))) {
      throw new BadRequestException("Parâmetro de ID inválido");
    }

    if (updates.password) {
      if (updates.password.length < 6) {
        throw new BadRequestException(Message.PASSWORD_LENGTH);
      }
      updates.password = await hashPassword(updates.password);
    }

    const [updatedId] = await User.update(updates, { where: { id } });

    if (updatedId) {
      const updated = await User.findByPk(id);
      const response = {
        id: updated?.dataValues.id,
        name: updated?.dataValues.name,
        email: updated?.dataValues.email,
      };
  
      res.status(200).json(response);
    } else {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    AuthorizationNeed(req);
    const id = req.params.id;

    if (isNaN(Number(id))) {
      throw new BadRequestException("Parâmetro de ID inválido");
    }

    const toDelete = await User.findByPk(id);

    if (!toDelete) {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }

    const destroyed: IUserResponseDTO = {
      id: toDelete.dataValues.id,
      name: toDelete.dataValues.name,
      email: toDelete.dataValues.email,
    };

    const deleted = await User.destroy({
      where: { id },
    });

    if (deleted) {
      res.status(200).json(destroyed);
    } else {
      throw new InternalServerException();
    }
  } catch (error) {
    next(error);
  }
};
