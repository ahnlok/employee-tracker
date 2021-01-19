drop database if exists employeeDB;

create database employeeDB;

use employeeDB;

create table department (
    id int not null auto_increment primary key,
    name varchar(30) not null,
);

create table role (
    id int not null auto_increment primary key,
    title varchar(30) not null,
    salary decimal,
    department_id int default 0,
);

create table employee (
    id int not null auto_increment primary key,
    first_name varchar(30) not null,
    last_name varcahr(30) not null,
    role_id int default 0,
    manager_id int null,
);

insert into department (name) values ("Sales"), ("Engineering"), ("Finance"), ("Legal"), ("Marketing");

select * from department