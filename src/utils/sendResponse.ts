import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any,
  message: string
) => {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data: data.response ? data.response : data,
    pagination: data.pagination ? data.pagination : undefined,
  });
};
