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

export const BASE_API = "/api";

export const TIME_ZONE = 9 * 60 * 60 * 1000;
