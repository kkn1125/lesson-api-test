import express from "express";
const schedule = express.Router();

schedule.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

schedule.get("/availables", async (req, res) => {
  console.log("get request available schedule list");
  res.send(
    JSON.stringify({
      ok: true,
      data: [],
    })
  );
});

export default schedule;
