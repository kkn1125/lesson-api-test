import "reflect-metadata";
import applicant from "@src/controller/applicant.controller";
import coach from "@src/controller/coach.controller";
import court from "@src/controller/court.controller";
import schedule from "@src/controller/schedule.controller";
import mariadbConfig from "@src/database/mariadb.config";
import { BASE_API, PORT } from "@src/util/global";
import cors from "cors";
import express from "express";

mariadbConfig
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization: ", err);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(BASE_API + "/schedule", schedule);
app.use(BASE_API + "/applicant", applicant);
app.use(BASE_API + "/court", court);
app.use(BASE_API + "/coach", coach);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
