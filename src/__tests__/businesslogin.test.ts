// function generateLessonSchedules() {
//   // return lesson schedule list
// }

import Schedule from "@src/entity/schedule.entity";
import ApplicantService from "@src/service/applicant.service";
import CoachService from "@src/service/coach.service";
import CourtService from "@src/service/court.service";
import ScheduleService, {
  expLessonList,
  regularLessonList,
} from "@src/service/schedule.service";

const courtService = new CourtService();
const coachService = new CoachService();
const scheduleService = new ScheduleService();
const applicantService = new ApplicantService();

describe("[스케줄] 생성 및 필터 테스트", () => {
  describe("아침 7시부터 저녁 17시까지 레슨 가능 일정 출력", () => {
    it("[SUCCESS]", () => {
      const list = scheduleService.generateScheduleTimes(
        "2023-09-12 07:00:00",
        "2023-09-13 17:00:00",
        30
      );
      expect(list.length).toStrictEqual(42);
    });
  });

  describe("체험형 레슨 필터", () => {
    it("[SUCCESS] ", () => {
      const list = scheduleService.generateScheduleTimes(
        "2023-09-12 07:00:00",
        "2023-09-13 17:00:00",
        30
      );
      const availableLessonList = scheduleService.filterExperienceLesson(
        list,
        scheduleService.timeMap(expLessonList as Schedule[])
      );
      expect(availableLessonList.length).toStrictEqual(42 - 4);
    });
  });

  describe("체험형 + 정규형 레슨 필터", () => {
    it("[SUCCESS]", () => {
      const list = scheduleService.generateScheduleTimes(
        "2023-09-12 07:00:00",
        "2023-09-13 17:00:00",
        30
      );
      const availableLessonList = scheduleService.filterExperienceLesson(
        list,
        scheduleService.timeMap(expLessonList as Schedule[])
      );

      const availableLessonResults = scheduleService.filterRegularLesson(
        availableLessonList,
        scheduleService.timeMap(regularLessonList as Schedule[])
      );
      expect(availableLessonResults.length).toStrictEqual(42 - 4 - 2);
    });
  });
});

describe("[신청자] 생성 및 일회성 계정 테스트", () => {
  describe("계정 생성", () => {
    it("[SUCCESS]", () => {
      const userAccount = applicantService.getOneTimeUserAccount();
      expect(userAccount).toBeDefined();
    });
  });

  describe("계정 생성 아이디 체크", () => {
    it("[SUCCESS]", () => {
      const userAccount = applicantService.getOneTimeUserAccount();
      expect(userAccount.user_id.length).toStrictEqual(48);
    });
  });

  describe("계정 생성 비밀번호 체크", () => {
    it("[SUCCESS]", () => {
      const userAccount = applicantService.getOneTimeUserAccount();
      expect(userAccount.user_password.length).toStrictEqual(96);
    });
  });

  describe("계정 생성 아이디, 비밀번호 체크", () => {
    it("[FAIL]", () => {
      const userAccount1 = applicantService.getOneTimeUserAccount();
      const userAccount2 = applicantService.getOneTimeUserAccount();
      expect(userAccount1.user_id).not.toStrictEqual(userAccount2.user_id);
      expect(userAccount2.user_id).not.toStrictEqual(userAccount1.user_id);
      expect(userAccount1.user_password).not.toStrictEqual(
        userAccount2.user_password
      );
      expect(userAccount2.user_password).not.toStrictEqual(
        userAccount1.user_password
      );
      console.log(userAccount1);
      console.log(userAccount2);
    });
  });
});
