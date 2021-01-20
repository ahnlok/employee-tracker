const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Ahn@lok123",
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
                "Update employee",
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

            case "Update employee":
                updateEmployee();
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
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
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
var roleArray = [];
function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err
        for(let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })
    return roleArray;
}

// Manager for adding employee prompt
let managerArray = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",  function(err, res) {
        if (err) throw err
        for(let i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name);
        }
    })
    return managerArray;
}

// Adding Employee information
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter employee's 'First Name'",
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter employee's 'Last Name'",
        },
        {
            type: "list",
            name: "role",
            message: "Choose the employee's 'Role'",
            choices: selectRole()
        },
        {
            type: "rawlist",
            name: "manager",
            message: "Choose the employee's 'Manager Name'",
            choices: selectManager()
        },
    ]).then((val) => {
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.manger) + 1
        connection.query("INSERT INTO employee SET ?", 
        {
            first_name: val.firstName,
            last_name: val.lastName,
            manager_id: managerId,
            role_id: roleId
        }, function(err) {
            if (err) throw error
            console.table(val)
            start();
        })

    })
}

// Updating employee information
function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id", function(err, res) {
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "lastname",
                type: "rawlist",
                choices: 
                function() {
                    let lastname = [];
                    for (let i = 0; i < res.length; i++) {
                        lastname.push(res[i].last_name);
                    }
                    return lastname;
                },
                message: "What is the last name of the employee?",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the new title for the employee?",
                choices: selectRole()
            },
        ]).then(function(val) {
            let roleId = selectRole().indexOf(val.role) + 1
            connection.query("UPDATE employee SET WHERE ?",
            {
                last_name: val.lastname
            },
            {
                role_id: roleId
            },
            function(err){
                if (err) throw error 
                console.table(val)
                start()
            })
        })
    })
}

// Adding Employee's Role
function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function(err, res) {
        inquirer.prompt([
        {
            name: "Title",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "Salary",
            type: "input",
            message: "What is the salary?"
        }
        ]).then((res) => {
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: res.Title,
                salary: res.Salary,
            },
            function(err) {
                if (err) throw error 
                console.table(res);
                start()
            }
        )
        })
    })
}

// Add department
function addDepartment() {
    inquirer.prompt ([
        {
        name: "name",
        type: "input",
        message: "What department would you like to add?"
        },
    ]).then((res) => {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name
            },
            function(err) {
                if (err) throw error 
                console.table(res);
                start();
            }
        )
    })
}