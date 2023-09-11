import CoachService from "@src/service/coach.service";
import express from "express";
const coach = express.Router();

const coachService = new CoachService();

coach.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

coach.get("/", async (req, res) => {
  res.send(
    JSON.stringify({
      ok: true,
      data: [],
    })
  );
});

coach.get("/available", async (req, res) => {
  const { name, time } = req.query as { name: string; time: string };
  const availableCoachs = await coachService.findAvailableCoachs(time);

  if (name) {
    const coach = availableCoachs.find((coach) => coach.name === name);
    if (coach) {
      return res.status(200).send(
        JSON.stringify({
          ok: true,
          data: coach,
        })
      );
    } else {
      return res.status(404).send(
        JSON.stringify({
          ok: false,
          message: "not found available coach",
          detail: `${name} coach is busy`,
        })
      );
    }
  }

  return res.send(
    JSON.stringify({
      ok: true,
      data: availableCoachs,
    })
  );
});

export default coach;
