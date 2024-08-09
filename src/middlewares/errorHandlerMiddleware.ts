import { ErrorRequestHandler } from "express";
import { IHttpResponse } from "../interfaces/interfaces";
import { ValidationError } from "sequelize";
import { Message } from "../utils/Message";

export const ErrorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof ValidationError) {
    if (err.name === "SequelizeValidationError") {
      status = 400;
      err.message = `Verifique os campos obrigatórios: [${err.errors.map(
        (erro) => `${erro.path}`
      )}]`;
    } else if (err.name === "SequelizeUniqueConstraintError") {
      status = 400;
      err.message = Message.DUPLICATED_EMAIL;
    }
  }

  const httpResponse: IHttpResponse = {
    status: err.statusCode || status,
    err: {
      message: err.message || message,
    },
  };

  res.status(httpResponse.status).json(httpResponse);
};
