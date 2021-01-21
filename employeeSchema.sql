DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

-- Department Table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

-- Role Table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT, 
  PRIMARY KEY (id)
);

-- Employee Table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);
-- Department seed
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Human Resources"), ("Legal"), ("Finance"), ("Artist");

-- Role seed
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 100000, 7), ("Software Developer", 70000, 2), ("Lawyer", 60000, 3), ("Software Engineer", 90000, 2), ("Sales Rep", 60000, 5), ("Digital Artist", 70000, 6), ("Junior Data Analyst", 40000, 1);

-- Employee seed
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jack", "Sparrow", 9, 1), ("Steve", "Woziniak", 2, 1), ("Ron", "Swanson", 3, 1), ("Luke", "William", 4, 3), ("Julius", "Caesar", 5, 1), ("George", "Lucas", 6, 1), ("Anakin", "Skywalker", 1, 1);

SELECT * FROM department;

SELECT * FROM roles;

SELECT * FROM employee;