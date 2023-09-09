import ScheduleService from "@src/service/schedule.service";
import { WEEK_TIME } from "@src/util/global";
import express from "express";
const schedule = express.Router();

const scheduleService = new ScheduleService();

schedule.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

schedule.get("/availables", async (req, res) => {
  const schedules = await scheduleService.repository.find();
  const currentBaseTime = new Date();
  const currentTime = new Date(
    currentBaseTime.getFullYear(),
    currentBaseTime.getMonth(),
    currentBaseTime.getDate() + 1,
    7,
    0,
    0
  );
  const searchLimitTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate() + 7,
    17,
    0,
    0
  );
  const timeList = scheduleService.generateScheduleTimes(
    currentTime,
    searchLimitTime,
    30
  );

  res.send(
    JSON.stringify({
      ok: true,
      data: timeList,
    })
  );
});

schedule.get("/:id", async (req, res) => {
  const { id } = req.params;

  const schedule = await scheduleService.repository.findOne({
    where: { id: Number(id) },
  });
  if (!schedule) {
    res.status(404).send(
      JSON.stringify({
        ok: false,
        message: "not found",
      })
    );
    return;
  }
  res.send(
    JSON.stringify({
      ok: true,
      data: schedule,
    })
  );
});

schedule.post("/", async (req, res) => {
  
  // scheduleService.repository.insert();
});

export default schedule;
