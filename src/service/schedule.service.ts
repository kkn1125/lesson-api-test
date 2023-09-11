import MariadbConfig from "@src/database/mariadb.config";
import Applicant from "@src/entity/applicant.entity";
import Schedule from "@src/entity/schedule.entity";
import { Repository } from "typeorm";
import { TIME_ZONE } from "../util/global";
import ApplicantService from "./applicant.service";

export const expLessonList = [
  { duration: 30, time: "2023-09-12 12:30:00" },
  { duration: 60, time: "2023-09-12 14:30:00" },
  { duration: 30, time: "2023-09-13 07:30:00" },
];

export const regularLessonList = [
  { duration: 30, time: "2023-09-12 13:00:00" },
  { duration: 30, time: "2023-09-13 10:00:00" },
];

export default class ScheduleService {
  repository: Repository<Schedule> = MariadbConfig.getRepository(Schedule);
  applicantService: ApplicantService = new ApplicantService();

  formatDashedDateTime = (time: string | Date, time_zone?: number) => {
    const base = new Date(time);
    return new Date(base.getTime() + (time_zone ?? TIME_ZONE))
      .toISOString()
      .replace("T", " ")
      .slice(0, -5);
  };

  findUserSchedule(id: string, password: string) {
    return this.repository.find({
      where: {
        applicant: {
          user_id: id,
          user_password: password,
        },
      },
      relations: {
        coach: true,
        court: true,
        applicant: true,
      },
    });
  }

  findAvailableLessonTimeInWeeks() {
    const base = new Date();
    const startTime = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + 1
    );
    const endTime = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + 1 + 7
    );
    const interval = 30;
    const lessonScheduleTimes = this.generateScheduleTimes(
      startTime,
      endTime,
      interval
    );
    return lessonScheduleTimes;
  }

  generateScheduleTimes(
    start: string | Date,
    end: string | Date,
    interval: number
  ) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const temp = [];
    while (startTime <= endTime) {
      const datetime = this.formatDashedDateTime(startTime);
      const time = datetime.split(" ").pop();
      if (this.workingTimes()[0] <= time && this.workingTimes()[1] >= time) {
        temp.push(datetime);
      }
      startTime.setMinutes(startTime.getMinutes() + interval);
    }
    return temp;
  }

  workingTimes() {
    return ["07:00:00", "17:00:00"];
  }

  timeMap(schedules: Schedule[]) {
    return schedules.reduce((acc, schedule) => {
      acc.push(this.formatDashedDateTime(schedule.time));
      if (schedule.duration > 30) {
        const base = new Date(schedule.time);
        for (let min = 30; min < schedule.duration; min += 30) {
          base.setMinutes(base.getMinutes() + min);
          const convert = this.formatDashedDateTime(base);
          console.log("convert", convert);
          acc.push(convert);
        }
      }
      return acc;
    }, []);
  }

  filterExperienceLesson(
    availableSchedules: string[],
    expLessonList: string[]
  ) {
    return availableSchedules.filter(
      (available) => !expLessonList.some((exp) => exp === available)
    );
  }

  filterRegularLesson(
    availableSchedules: string[],
    regularLessonList: string[]
  ) {
    return availableSchedules.filter(
      (available) =>
        !regularLessonList.some(
          (regular) =>
            regular.split(" ")[1] === available.split(" ")[1] &&
            new Date(regular).getDay() === new Date(available).getDay()
        )
    );
  }

  findFilteredAvailableSchedules(
    irregularSchedules: Schedule[],
    regularSchedules: Schedule[]
  ) {
    const scheduleTimes = this.findAvailableLessonTimeInWeeks();
    const expTimes = this.timeMap(irregularSchedules);
    const experienceLessonFilteredSchedules = this.filterExperienceLesson(
      scheduleTimes,
      expTimes
    );

    const regTimes = this.timeMap(regularSchedules);
    const availableLessonSchedules = this.filterRegularLesson(
      experienceLessonFilteredSchedules,
      regTimes
    );
    return availableLessonSchedules;
  }

  async createSchedule(
    applicant: Applicant,
    court_id: number,
    coach_id: number,
    schedule_info: {
      time: string[];
      duration: number;
      type: string;
    }
  ) {
    let scheduleSaves: Schedule[] = [];
    const queryRunner = MariadbConfig.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const waitListScheduleSaves: Promise<Schedule>[] = [];

      console.log("new applicant", applicant);
      for (let eachTime of schedule_info.time) {
        const schedule = new Schedule();
        schedule.coach_id = coach_id;
        schedule.court_id = court_id;
        schedule.applicant_id = applicant.id;
        schedule.time = eachTime;
        schedule.duration = schedule_info.duration;
        schedule.type = schedule_info.type;

        waitListScheduleSaves.push(schedule.save());
      }

      scheduleSaves = await Promise.all<Promise<Schedule>[]>(
        waitListScheduleSaves
      );

      console.log("schedules are success inserted!", scheduleSaves);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return scheduleSaves;
  }

  async createScheduleWithUserInfo(
    court_id: number,
    coach_id: number,
    name: string,
    phone_number: string,
    schedule_info: {
      time: string[];
      duration: number;
      type: string;
    }
  ): Promise<[{ user_id: string; user_password: string }, Schedule[]]> {
    let scheduleSaves: Schedule[] = [];
    const queryRunner = MariadbConfig.createQueryRunner();
    const userAccount = this.applicantService.getOneTimeUserAccount();

    await queryRunner.startTransaction();

    try {
      const waitListScheduleSaves: Promise<Schedule>[] = [];
      const applicant = new Applicant();
      applicant.user_id = userAccount.user_id;
      applicant.user_password = userAccount.user_password;
      applicant.name = name;
      applicant.phone_number = phone_number;

      const newApplicant = await applicant.save();
      console.log("new applicant", newApplicant);
      for (let eachTime of schedule_info.time) {
        const schedule = new Schedule();
        schedule.coach_id = coach_id;
        schedule.court_id = court_id;
        schedule.applicant_id = newApplicant.id;
        schedule.time = eachTime;
        schedule.duration = schedule_info.duration;
        schedule.type = schedule_info.type;

        waitListScheduleSaves.push(schedule.save());
      }

      scheduleSaves = await Promise.all<Promise<Schedule>[]>(
        waitListScheduleSaves
      );

      console.log("schedules are success inserted!", scheduleSaves);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return [userAccount, scheduleSaves];
  }
}
