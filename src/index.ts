import express from "express";
import cors from "cors";
import { BASE_API, PORT } from "./util/global";
import schedule from "./controller/schedule.controller";
import applicant from "./controller/applicant.controller";
import court from "./controller/court.controller";
import coach from "./controller/coach.controller";

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
