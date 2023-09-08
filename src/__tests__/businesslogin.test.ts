// function generateLessonSchedules() {
//   // return lesson schedule list
// }

import ScheduleService, {
  expLessonList,
  regularLessonList,
} from "@src/service/schedule.service";

const scheduleService = new ScheduleService();

describe("[스케줄] 생성 및 필터 테스트", () => {
  describe("아침 7시부터 저녁 17시까지 레슨 가능 일정 출력", () => {
    it("[SUCCESS]", () => {
      const list = scheduleService.generateScheduleTimes(
        "2023-09-08 07:00:00",
        "2023-09-09 17:00:00",
        30
      );
      expect(list.length).toStrictEqual(42);
    });
  });

  describe("체험형 레슨 필터", () => {
    it("[SUCCESS] ", () => {
      const list = scheduleService.generateScheduleTimes(
        "2023-09-08 07:00:00",
        "2023-09-09 17:00:00",
        30
      );
      const availableLessonList = scheduleService.filterExperienceLesson(
        list,
        expLessonList
      );
      console.log("availableLessonList", availableLessonList);
      expect(availableLessonList.length).toStrictEqual(42 - 3);
    });
  });

  describe("체험형 + 정규형 레슨 필터", () => {
    it("[SUCCESS]", () => {
      const list = scheduleService.generateScheduleTimes(
        "2023-09-08 07:00:00",
        "2023-09-09 17:00:00",
        30
      );
      const availableLessonList = scheduleService.filterExperienceLesson(
        list,
        expLessonList
      );

      const availableLessonResults = scheduleService.filterRegularLesson(
        availableLessonList,
        regularLessonList
      );
      console.log("availableLessonResults", availableLessonResults);
      expect(availableLessonResults.length).toStrictEqual(42 - 3 - 2);
    });
  });
});
