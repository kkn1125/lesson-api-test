use custom;

show tables;
desc schedule;
select * from coach;
select * from court;
select * from schedule;

insert into coach (name) values ('kimson'), ('john'),('tom'),('marco'),('peter');
insert into court (num) values (1),(2),(3),(4),(5);

insert into schedule (court_id, coach_id, applicant_id, time, duration, type, amount) values
(1,
1,
1, "2023-09-10 12:00:00", 30, "irregular");
insert into schedule (court_id, coach_id, applicant_id, time, duration, type, amount) values
(1,
1,
1, "2023-09-10 12:00:00", 30, "irregular");