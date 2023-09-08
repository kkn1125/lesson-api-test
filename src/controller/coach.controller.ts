import express from "express";
const schedule = express.Router();

schedule.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

schedule.get("/", async (req, res) => {
  console.log("get request coachs");
  res.send(
    JSON.stringify({
      ok: true,
      data: [],
    })
  );
});

export default schedule;
