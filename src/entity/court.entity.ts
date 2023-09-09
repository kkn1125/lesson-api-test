import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm/decorator/columns/Column";
import { CreateDateColumn } from "typeorm/decorator/columns/CreateDateColumn";
import { UpdateDateColumn } from "typeorm/decorator/columns/UpdateDateColumn";
import Schedule from "./schedule.entity";

@Entity()
export default class Court extends BaseEntity {
  // court entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  num: number;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;

  @OneToMany((type) => Schedule, (Schedule) => Schedule.court)
  schedules: Schedule[];
}
