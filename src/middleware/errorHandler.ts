import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
    status?: number;
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: CustomError, req: Request, res: Response , _next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandler;
