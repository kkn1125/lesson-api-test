import { TIME_ZONE } from "../util/global";

export const expLessonList = [
  "2023-09-08 12:30:00",
  "2023-09-08 14:30:00",
  "2023-09-09 07:30:00",
];

export const regularLessonList = ["2023-09-01 13:00:00", "2023-09-02 10:00:00"];

export default class ScheduleService {
  generateScheduleTimes(start: string, end: string, interval: number) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const temp = [];
    while (startTime <= endTime) {
      const datetime = new Date(startTime.getTime() + TIME_ZONE)
        .toISOString()
        .replace("T", " ")
        .slice(0, -5);
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

  filterExperienceLesson(
    availableSchedules: string[],
    expLessonList: string[]
  ) {
    return availableSchedules.filter(
      (available) => !expLessonList.includes(available)
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
}
