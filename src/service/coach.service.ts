import MariadbConfig from "@src/database/mariadb.config";
import Coach from "@src/entity/coach.entity";
import { Repository } from "typeorm";

export default class CoachService {
  repository: Repository<Coach> = MariadbConfig.getRepository(Coach);
}
