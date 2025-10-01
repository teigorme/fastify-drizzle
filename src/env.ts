import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  HOST: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().min(1).max(65535).default(3333),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchema.parse(process.env);
