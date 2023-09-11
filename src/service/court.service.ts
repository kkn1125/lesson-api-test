import MariadbConfig from "@src/database/mariadb.config";
import Court from "@src/entity/court.entity";
import { Repository } from "typeorm";

export default class CourtService {
  repository: Repository<Court> = MariadbConfig.getRepository(Court);

  findAvailableCourts(currentUsingCourts: Court[]) {
    const courtList = [1, 2, 3, 4, 5];
    for (const court of currentUsingCourts) {
      if (courtList.includes(court.num)) {
        courtList.splice(courtList.indexOf(court.num), 1);
      }
    }
    return courtList;
  }
}
