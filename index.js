// Dependencies
const inquirer = require("inquirer")
const mysql = require("mysql")
const figlet = require("figlet");

// Connection Route
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ahn@lok123",
    database: "employees_DB"
});

// figlet
figlet('Employee Tracker', (err, res) => {
  console.log(err || res);
});

//Connection ID
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    init();
});

// Starting Prompt
function init() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "VIEW ALL EMPLOYEES",
              "VIEW ALL ROLES",
              "VIEW ALL DEPARTMENTS",
              "ADD EMPLOYEE",
              "ADD ROLE",
              "ADD DEPARTMENT",
              "UPDATE",
              "EXIT"
            ],
    },
]).then(function(val) {
  switch (val.choice) {
    case "VIEW ALL EMPLOYEES":
      viewAllEmployees();
      break;

    case "VIEW ALL ROLES":
      viewAllRoles();
      break;

    case "VIEW ALL DEPARTMENTS":
      viewAllDepartments();
      break;

    case "ADD EMPLOYEE":
      addEmployee();
      break;

    case "ADD ROLE":
      addRole();
      break;

    case "ADD DEPARTMENT":
      addDepartment();
      break;

    case "UPDATE":
      updateEmployee();
      break;

    default:
      connection.end();
      break;
    };
  });
};

//View Employee
function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res)
    init()
  })
}

// View Roles
function viewAllRoles() {
  connection.query("SELECT * FROM role", 
  function (err, res) {
  if (err) throw err;
  console.table(res)
  init()
  })
}

// View Department
function viewAllDepartments() {
  connection.query("SELECT * FROM department", 
  function(err, res) {
    if (err) throw err;
    console.table(res)
    init()
  })
}

// Add Employee
function addEmployee() {
  inquirer.prompt ([
    {
      type: "input",
      name: "firstName",
      message: "What is the 'First Name' of the employee?"
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the 'Last Name' of the employee?"
    },
    {
      type: "number",
      name: "roleId",
      message: "What is the 'Role ID' of the employee?"
    },
    {
      type: "number",
      name: "managerId",
      message: "What is the 'Manager ID' of the employee?"
    },
  ]).then(function(answer) {
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${answer.roleId}', '${answer.managerId}')`,
    // [res.firstName, res.lastName, res.roleId, res.managerId], 
    function(err, res) {
      if (err) throw err;
      console.log("New Employee Information Added Successfully!" + "\n")
      console.log(answer.firstName + " " + answer.lastName + "\n");
      viewAllEmployees();
      
    });
  });
}
  


