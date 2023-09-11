import MariadbConfig from "@src/database/mariadb.config";
import Coach from "@src/entity/coach.entity";
import { In, IsNull, Not, Repository } from "typeorm";

export default class CoachService {
  repository: Repository<Coach> = MariadbConfig.getRepository(Coach);

  async findAvailableCoachs(time: string) {
    return this.repository.find({
      where: {
        id: Not(
          In(
            (
              await this.repository.find({
                select: { id: true },
                where: {
                  schedules: { time: time },
                },
              })
            ).map((coach) => coach.id)
          )
        ),
      },
    });
  }

  async isAvailableCoach(name: string, time: string): Promise<Coach>;
  async isAvailableCoach(name: string, times: string[]): Promise<Coach>;
  async isAvailableCoach(
    name: string,
    times: string | string[]
  ): Promise<Coach> {
    if (times instanceof Array) {
      return await this.repository.findOne({
        where: times.map((tm) => ({
          schedules: {
            time: tm,
          },
          name: name,
        })),
      });
    } else {
      return await this.repository.findOne({
        where: {
          schedules: {
            time: times,
          },
          name: name,
        },
      });
    }
  }
}
