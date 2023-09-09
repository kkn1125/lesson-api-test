import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm/decorator/columns/Column";
import { CreateDateColumn } from "typeorm/decorator/columns/CreateDateColumn";
import { UpdateDateColumn } from "typeorm/decorator/columns/UpdateDateColumn";
import Applicant from "./applicant.entity";
import Coach from "./coach.entity";
import Court from "./court.entity";

@Entity()
export default class Schedule extends BaseEntity {
  // schedule entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  court_id: number;
  @Column()
  coach_id: number;
  @Column()
  applicant_id: number;
  @Column()
  time: string;
  @Column()
  duration: number;
  @Column()
  type: string;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne((type) => Coach, (Coach) => Coach.schedules)
  coach: Coach;
  @ManyToOne((type) => Court, (Court) => Court.schedules)
  court: Court;
  @ManyToOne((type) => Applicant, (Applicant) => Applicant.schedules)
  applicant: Applicant;
}
