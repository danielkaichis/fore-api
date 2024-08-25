import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const ENVIRONMENT = process.env.NODE_ENV || "dev";
export const CLIENT_ORIGIN_URL =
  process.env.CLIENT_ORIGIN_URL || "http://localhost:3002";