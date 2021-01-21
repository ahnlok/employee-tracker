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
              "DELETE",
              "EXIT"
            ]
    }
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
      // employees = res;
    console.table(res)
    init()
  })
}

// View Roles
function viewAllRoles() {
  connection.query("SELECT * FROM role", 
  function (err, res) {
  // roles = res;
  if (err) throw err
  console.table(res)
  init()
  })
}

// View Department
function viewAllDepartments() {
  connection.query("SELECT * FROM department", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    init()
  })
}


  


