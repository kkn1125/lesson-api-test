import Schedule from "@src/entity/schedule.entity";
import CoachService from "@src/service/coach.service";
import CourtService from "@src/service/court.service";
import ScheduleService from "@src/service/schedule.service";
import { DAY_TO_KOR } from "@src/util/global";
import express from "express";
const schedule = express.Router();

const coachService = new CoachService();
const courtService = new CourtService();
const scheduleService = new ScheduleService();

schedule.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

schedule.get("/availables", async (req, res) => {
  const { coachName } = req.query as { coachName: string };
  const irregularSchedules = await scheduleService.repository.find({
    where: {
      type: "irregular",
      coach: {
        name: coachName,
      },
    },
  });
  const regularSchedules = await scheduleService.repository.find({
    where: {
      type: "regular",
      coach: {
        name: coachName,
      },
    },
  });

  const availableScheduls = scheduleService.findFilteredAvailableSchedules(
    irregularSchedules,
    regularSchedules
  );

  res.send(
    JSON.stringify({
      ok: true,
      data: availableScheduls,
      total: availableScheduls.length,
    })
  );
});

// schedule.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   const schedule = await scheduleService.repository.findOne({
//     where: { id: Number(id) },
//   });
//   if (!schedule) {
//     res.status(404).send(
//       JSON.stringify({
//         ok: false,
//         message: "not found",
//       })
//     );
//     return;
//   }
//   res.send(
//     JSON.stringify({
//       ok: true,
//       data: schedule,
//     })
//   );
// });

schedule.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.query;
  const userSchedule: Schedule[] = await scheduleService.findUserSchedule(
    id,
    password as string
  );
  if (userSchedule.length === 0) {
    return res.status(404).send(
      JSON.stringify({
        ok: false,
        message: "not found user's schedules",
      })
    );
  }

  const scheduleTimes = userSchedule
    .map((schedule) => [
      DAY_TO_KOR[new Date(schedule.time).getDay()],
      scheduleService.formatDashedDateTime(schedule.time),
    ])
    .sort((a: [string, string], b: [string, string]) =>
      a[1].localeCompare(b[1])
    ) as [string, string][];

  const coach = userSchedule[0].coach.name;
  const court = userSchedule[0].court.num;
  const type = userSchedule[0].type;
  const duration = userSchedule[0].duration;

  return res.status(200).send(
    JSON.stringify({
      ok: true,
      data: {
        coach,
        court,
        type,
        duration,
        lessons: scheduleTimes,
        amount: scheduleTimes.length,
      },
    })
  );
});

schedule.post("/", async (req, res) => {
  // scheduleService.repository.insert();
  const { coachName, time, duration, phone_number, name, type } = req.body;
  const times = [].concat(time).flat(2);
  const isAvailableCoach = await coachService.isAvailableCoach(coachName, time);

  const coach = await coachService.repository.findOne({
    where: { name: coachName },
  });

  console.log("isAvailableCoach", isAvailableCoach);

  if (!!isAvailableCoach) {
    return res.status(400).send(
      JSON.stringify({
        ok: false,
        message: "coach is busy.",
      })
    );
  }

  const irregulars = await scheduleService.repository.find({
    where: {
      type: "irregular",
      coach: {
        name: coachName,
      },
    },
  });
  const regulars = await scheduleService.repository.find({
    where: {
      type: "regular",
      coach: {
        name: coachName,
      },
    },
  });

  const availableScheduls = scheduleService.findFilteredAvailableSchedules(
    irregulars,
    regulars
  );

  const isAllAvailable = times.filter((tm) => !availableScheduls.includes(tm));

  if (isAllAvailable.length > 0) {
    return res.status(400).send(
      JSON.stringify({
        ok: false,
        message: "No scheduler available",
        detail: isAllAvailable,
      })
    );
  }

  const availableCourts = await courtService.repository.find({
    where: times.map((tm) => ({
      schedules: {
        time: tm,
      },
    })),
  });

  const [userInfo, scheduleSaves] =
    await scheduleService.createScheduleWithUserInfo(
      availableCourts[0].id,
      coach.id,
      name,
      phone_number,
      {
        time: times,
        duration,
        type,
      }
    );

  return res.status(201).send(
    JSON.stringify({
      ok: true,
      id: userInfo.user_id,
      password: userInfo.user_password,
      startLessonDate: scheduleSaves[0].time,
      data: scheduleSaves,
    })
  );
});

schedule.put("/id/:id", async (req, res) => {
  const { id } = req.params;
  const { password, duration, type, time, coachName, phone_number, name } =
    req.body;
  const times = [].concat(time).flat(2);

  const isAvailableCoach = await coachService.isAvailableCoach(coachName, time);
  console.log("coachName", coachName);
  const coach = await coachService.repository.findOne({
    where: { name: coachName },
  });
  console.log("isAvailableCoach", isAvailableCoach);
  if (!!isAvailableCoach) {
    return res.status(400).send(
      JSON.stringify({
        ok: false,
        message: "coach is busy.",
      })
    );
  }

  const irregulars = await scheduleService.repository.find({
    where: {
      type: "irregular",
      coach: {
        name: coachName,
      },
    },
  });
  const regulars = await scheduleService.repository.find({
    where: {
      type: "regular",
      coach: {
        name: coachName,
      },
    },
  });

  const availableScheduls = scheduleService.findFilteredAvailableSchedules(
    irregulars,
    regulars
  );

  const isAllAvailable = times.filter((tm) => !availableScheduls.includes(tm));

  if (isAllAvailable.length > 0) {
    return res.status(400).send(
      JSON.stringify({
        ok: false,
        message: "No scheduler available",
        detail: isAllAvailable,
      })
    );
  }

  const schedules = await scheduleService.repository.find({
    where: {
      applicant: { user_id: id, user_password: password },
    },
    relations: {
      applicant: true,
      court: true,
      coach: true,
    },
  });

  const court = schedules[0].court;
  const applicant = schedules[0].applicant;

  name && (applicant.name = name);
  phone_number && (applicant.phone_number = phone_number);

  await applicant.save();

  for (const schedule of schedules) {
    await schedule.remove();
  }

  const scheduleSaves = await scheduleService.createSchedule(
    applicant,
    court.id,
    coach.id,
    {
      time: times,
      duration,
      type,
    }
  );

  return res.status(201).send(
    JSON.stringify({
      ok: true,
      id: applicant.user_id,
      password: applicant.user_password,
      startLessonDate: scheduleSaves[0].time,
      data: scheduleSaves,
    })
  );
});

export default schedule;
