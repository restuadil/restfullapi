import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000").transform(Number), // Default port 3000
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

// Validasi environment variables
const envValidation = envSchema.safeParse(process.env);

// Jika validasi gagal, throw error dengan pesan yang jelas
if (!envValidation.success) {
  console.error(
    "Invalid environment variables:",
    envValidation.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

// Export environment variables yang sudah divalidasi
export const env = envValidation.data;
