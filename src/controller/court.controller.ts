import express from "express";
const court = express.Router();

court.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

court.get("/", async (req, res) => {
  console.log("get request courts");
  res.send(
    JSON.stringify({
      ok: true,
      data: [],
    })
  );
});

export default court;
