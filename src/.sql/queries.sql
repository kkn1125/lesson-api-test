use custom;

show tables;
desc schedule;
select * from coach;
select * from court;
select * from schedule;
select * from applicant;

insert into coach (name) values ('kimson'), ('john'),('tom'),('marco'),('peter');
insert into court (num) values (1),(2),(3),(4),(5);

insert into applicant (name, phone_number) values("toms", "010-2020-1234");

insert into schedule (court_id, coach_id, applicant_id, time, duration, type) values
(1,
1,
1, "2023-09-10 12:00:00", 30, "irregular");
insert into schedule (court_id, coach_id, applicant_id, time, duration, type) values
(1,
1,
1, "2023-09-10 12:00:00", 30, "irregular");


select * from schedule;
select distinct coach.* from coach left join schedule on coach.id = schedule.coach_id where schedule.time is null or schedule.time != '2023-09-12 12:30:00';
SELECT 
    coach.*
FROM
    coach
        LEFT JOIN
    schedule ON coach.id = schedule.coach_id
WHERE
    coach.id NOT IN (SELECT 
            coach.id
        FROM
            schedule
                LEFT JOIN
            coach ON schedule.coach_id = coach.id
        WHERE
            time = '2023-09-12 12:00:00');
