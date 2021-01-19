const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "employeeDB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    start();
});
// Function to start
function start() {
    inquirer.prompt([
        {
            type: "list",
            choices: ["Engineering", "Finance", "Legal", "Marketing", "Sales", "Exit"],
            message: "What department is the employee in?",
            name: "department",
        },
    ]).then((answer) => {
        if (answer.department === "Engineering") {
            createEmployee();
        } else if (answer.department === "Finance") {
            createEmployee();
        } else if (answer.department === "Legal") {
            createEmployee();
        } else if (answer.department === "Marketing") {
            createEmployee();
        } else if (answer.department === "Sales") {
            createEmployee();
        } else {
            connection.end();
        }
    });
}
// Create employee to the list function
function createEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName",
        },
        {
            type: "input",
            message: "What role is the employee?",
            name: "role",
        },
    ]).then((answer) => {
        connection.querry(
            "Insert into Employee List ?",
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                employee_role: answer.role

            },
        (err) => {
            if (err) throw err;
            console.log("Successfully register employee information!");
            start();
            }
        );
    });
}
