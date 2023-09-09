import dotenv from "dotenv";
import path from "path";

export const MODE = process.env.NODE_ENV as string;

dotenv.config({
  path: path.join(path.resolve(), ".env"),
});
dotenv.config({
  path: path.join(path.resolve(), `.env.${MODE}`),
});

export const IS_DEV = MODE === "development";
export const HOST = process.env.HOST as string;
export const PORT = Number(process.env.PORT) || 5000;
export const TIME_ZONE = 1000 * 60 * 60 * 9;
export const WEEK_TIME = 1000 * 60 * 60 * 24 * 7;
export const BASE_API = "/api";

// database options
export const DB_HOST = process.env.DB_HOST as string;
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_NAME = process.env.DB_NAME as string;
