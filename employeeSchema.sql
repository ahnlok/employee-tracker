DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY key,
    name VARCHAR(30 )
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Legal");
INSERT INTO department (name)
VALUE ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 120000, 22);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Associate", 45000, 12);
INSERT INTO role (title, salary, department_id)
VALUE ("Senior Marketing Manager", 110000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Data Analyst", 90000, 66);
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Software Engineer", 130000, 33);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tony", "Stark", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("James", "Cameron", 3, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Marc", "Jacobs", 2, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Michael", "Jung", null, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Henry", "Bourbon", null, 5);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
