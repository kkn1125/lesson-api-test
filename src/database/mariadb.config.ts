import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
} from "@src/util/global";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export default new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: ["src/entity/*.ts"],
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy(),
});
