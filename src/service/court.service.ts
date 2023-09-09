import MariadbConfig from "@src/database/mariadb.config";
import Court from "@src/entity/court.entity";
import { Repository } from "typeorm";

export default class CourtService {
  repository: Repository<Court> = MariadbConfig.getRepository(Court);
}
