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

let scheduleList = [];

describe("[스케줄 컨트롤러 테스트]", () => {
  describe("스케줄 유휴 코트 찾기", () => {
    // beforeAll(async () => {
    //   await scheduleRepo.delete(scheduleList.map((schedule) => schedule.id));
    // });
    it("[SUCCESS] 레포지토리 정의", () => {
      expect(scheduleRepo).toBeDefined();
    });
    it("[SUCCESS] 스케줄 찾기", async () => {
      const schedules = await scheduleRepo.find();
      expect(schedules.length).toStrictEqual(0);
    });
    it("[SUCCESS] 스케줄 생성", async () => {
      // lesson info
      const time = ["2023-09-10 12:00:00"];
      const amount = time.length;
      const type = "irregular";
      const duration = 30;

      // applicant info
      // const applicant = new Applicant();
      // const userAccount = applicantService.getOneTimeUserAccount();
      // applicant.user_id = userAccount.user_id;
      // applicant.user_password = userAccount.user_password;
      // applicant.name = "kimson";
      // applicant.phone_number = "010-2020-1234";
      // const newApplicant = await applicant.save();

      // court info
      const availableCourt = await courtRepo.find({
        relations: {
          schedules: {
            court: true,
            coach: true,
            applicant: true,
          },
        },
      });
      console.log("availableCourt", availableCourt);

      // coach info

      // const schedules = await scheduleRepo.insert({
      //   applicant_id: newApplicant.id,
      // });
    });
  });
});

describe("[신청자 컨트롤러 테스트]", () => {
  describe("신청자 찾기", () => {
    it("[SUCCESS] 레포지토리 정의", () => {
      expect(applicantRepo).toBeDefined();
    });
    it("[SUCCESS] 신청자 찾기", async () => {
      const schedules = await applicantRepo.find();
      expect(schedules.length).toStrictEqual(1);
    });
  });
});
