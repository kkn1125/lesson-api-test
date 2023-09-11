declare type LessonType = "irregular" | "regular";

declare interface LessonApplyType {
  coachName: string;
  time: string[];
  duration: number;
  phone_number: string;
  name: string;
  type: LessonType;
}

declare interface LessonUserInfo {
  id: string;
  password: string;
}
