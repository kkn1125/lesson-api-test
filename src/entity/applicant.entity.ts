import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm/decorator/columns/Column";
import { CreateDateColumn } from "typeorm/decorator/columns/CreateDateColumn";
import { UpdateDateColumn } from "typeorm/decorator/columns/UpdateDateColumn";
import Schedule from "./schedule.entity";

@Entity()
export default class Applicant extends BaseEntity {
  // applicant entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  phone_number: string;
  @Column()
  user_id: string;
  @Column()
  user_password: string;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;

  @OneToMany((type) => Schedule, (Schedule) => Schedule.applicant)
  schedules: Schedule[];
}
