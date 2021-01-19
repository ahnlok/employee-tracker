const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "employeeDB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    start();
});

// Function to bring out start prompts
function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View all employees",
                "View all employees by 'Role'",
                "View all employees by 'Department'",
                "Add employee",
                "Add role",
                "Add department"
                ],
        },
    ]).then(function(data) {
        switch (data.choice) {
            case "View all employees":
                viewEmployee();
            break;

            case "View all employees by 'Role'":
                viewRole();
            break;

            case "View all employees by 'Department'":
                viewDepartment();
            break;

            case "Add employee":
                addEmployee();
            break;

            case "Add role":
                addRole();
            break;

            case "Add department":
                addDepartment();
            break;
        }

    })
}

// Viewing all employees
function viewEmployee() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) As Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role department_id left join employee e on employee.manager_id= e.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        start();
    })
}

// Viewing all roles
function viewRole() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        start();
    })
}

// View all departments
function viewDepartment() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        start();
    })
}

// Role title for adding employee prompt
const roleArray = [];
function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {}
}