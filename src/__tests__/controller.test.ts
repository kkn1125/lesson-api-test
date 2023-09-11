import MariadbConfig from "@src/database/mariadb.config";
import Applicant from "@src/entity/applicant.entity";
import ApplicantService from "@src/service/applicant.service";
import CoachService from "@src/service/coach.service";
import CourtService from "@src/service/court.service";
import ScheduleService from "@src/service/schedule.service";

const applicantService = new ApplicantService();
const applicantRepo = applicantService.repository;

const scheduleService = new ScheduleService();
const scheduleRepo = scheduleService.repository;

const courtService = new CourtService();
const courtRepo = courtService.repository;

const coachService = new CoachService();
const coachRepo = coachService.repository;

beforeAll(async () => {
  await MariadbConfig.initialize();
  console.log("Mariadb config initialized!");
});

afterAll(async () => {
  await MariadbConfig.destroy();
  console.log("Mariadb config destroyed!");
});

describe("[스케줄 컨트롤러 테스트]", () => {
  describe("스케줄 유휴 코트 찾기", () => {
    // beforeAll(async () => {
    //   await scheduleRepo.delete(scheduleList.map((schedule) => schedule.id));
    // });
    it("[SUCCESS] 레포지토리 정의", () => {
      expect(scheduleService).toBeDefined();
      expect(scheduleRepo).toBeDefined();
    });
    it("[SUCCESS] 스케줄 찾기", async () => {
      const coachName = "kimson";
      const irregularSchedules = await scheduleRepo.find({
        where: {
          type: "irregular",
          coach: {
            name: coachName,
          },
        },
      });
      const regularSchedules = await scheduleRepo.find({
        where: {
          type: "regular",
          coach: {
            name: coachName,
          },
        },
      });
      const availableLessonSchedules =
        scheduleService.findFilteredAvailableSchedules(
          irregularSchedules,
          regularSchedules
        );

      expect(availableLessonSchedules.length).toStrictEqual(147 - 2);
    });
    // it("[SUCCESS] 스케줄 생성", async () => {
    //   // lesson info
    //   const time = ["2023-09-10 12:00:00"];
    //   const type = "irregular";
    //   const duration = 30;

    //   // court info
    //   const courtNum = 1;
    //   const availableCourt = await courtRepo.findOne({
    //     where: {
    //       num: courtNum,
    //     },
    //   });

    //   // coach info
    //   const coachName = "kimson";
    //   const availableCoach = await coachRepo.findOne({
    //     where: {
    //       name: coachName,
    //     },
    //   });

    //   const doneList = await scheduleService.createSchedule(
    //     availableCourt.id,
    //     availableCoach.id,
    //     {
    //       time,
    //       type,
    //       duration,
    //     }
    //   );

    //   console.log("doneList", doneList);

    //   expect(doneList.length).toStrictEqual(2);
    // });
    it("[FAIL] 스케줄 생성 트랜젝션 취소", async () => {});
  });
});

describe("[신청자 컨트롤러 테스트]", () => {
  describe("신청자 찾기", () => {
    it("[SUCCESS] 레포지토리 정의", () => {
      expect(applicantRepo).toBeDefined();
    });
    it("[SUCCESS] 신청자 찾기", async () => {
      const schedules = await applicantRepo.find();
      expect(schedules.length).toStrictEqual(2);
    });
  });
});

describe("코트 비즈니스 로직", () => {
  describe("유휴 코트 조회", () => {
    it("[SUCCESS]", async () => {
      const time = "2023-09-12 12:00:00";
      const usingCourts = await courtService.repository.find({
        where: {
          schedules: {
            time: time,
          },
        },
      });
      const availableCourts = courtService.findAvailableCourts(usingCourts);

      expect(availableCourts.length).toStrictEqual(4);
      console.log("사용가능한 첫 번째 코트", availableCourts[0]);
      expect(availableCourts[0]).toStrictEqual(2);
    });
  });
});

describe("코치 비즈니스 로직", () => {
  describe("유휴 코치 조회", () => {
    it("[SUCCESS]", async () => {
      const name = "kimson";
      const time = "2023-09-12 12:00:00";

      const isAvailableCoach = await coachService.isAvailableCoach(name, time);
      expect(isAvailableCoach).toBeFalsy();
    });
  });
});
