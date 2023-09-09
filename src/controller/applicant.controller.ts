import ApplicantService from "@src/service/applicant.service";
import express from "express";
const applicant = express.Router();

const applicantService = new ApplicantService();

applicant.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

applicant.get("/", async (req, res) => {
  const applicants = await applicantService.repository.find();
  res.status(200).send(
    JSON.stringify({
      ok: true,
      data: applicants,
    })
  );
});

applicant.post("/", async (req, res) => {
  const requiredFields = ["name", "phone_number"];
  try {
    const applicant = await applicantService.repository.insert(req.body);
    if (applicant.raw.affectedRows === 0) {
      res.status(500).send(
        JSON.stringify({
          ok: false,
          message: "fail",
        })
      );
      return;
    }
    res.status(201).send(
      JSON.stringify({
        ok: true,
        message: "success",
      })
    );
  } catch (error) {
    if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
      return res.status(500).send(
        JSON.stringify({
          ok: false,
          message: "no field value",
          detail: requiredFields.filter((field) => !(field in req.body)),
        })
      );
    }
    return res.status(500).send(
      JSON.stringify({
        ok: false,
        message: "fail",
      })
    );
  }
});

export default applicant;
