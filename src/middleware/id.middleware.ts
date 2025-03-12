import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Schema untuk validasi ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId",
  });

// Middleware untuk validasi ID
export const validateIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id; // Ambil ID dari parameter route

  try {
    // Validasi ID menggunakan Zod
    objectIdSchema.parse(id);
    next(); // Lanjut ke handler berikutnya jika ID valid
  } catch (error) {
    // Jika ID tidak valid, kirim respons error
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid ID format",
    });
  }
};
