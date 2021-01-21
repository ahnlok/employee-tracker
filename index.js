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
              "UPDATE EMPLOYEE ID",
              "DELETE EMPLOYEE",
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

    case "UPDATE EMPLOYEE ID":
      updateEmployee();
      break;

    case "DELETE EMPLOYEE":
      deleteEmployee();
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
    console.table(res);
    init();
  })
}

// View Roles
function viewAllRoles() {
  connection.query("SELECT * FROM roles", 
  function (err, res) {
  if (err) throw err;
  console.table(res);
  init();
  })
}

// View Department
function viewAllDepartments() {
  connection.query("SELECT * FROM department", 
  function(err, res) {
    if (err) throw err;
    console.table(res);
    init();
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
    function(err, res) {
      if (err) throw err;
      console.log("New Employee Information Added Successfully!" + "\n")
      console.log(answer.firstName + " " + answer.lastName + "\n");
      viewAllEmployees();
    });
  });
}
  
// Add Roles
function addRole(){
  inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "What is the 'Title' of this 'Role'?"
    },
    {
      type: "number",
      name: "salaryAmount",
      message: "Please enter the amount of 'Salary' for this role?"
    },
    {
      type: "number",
      name: "departmentId",
      message: "Please enter the 'Department ID'?"
    },
  ]).then(function(answer) {
    connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answer.roleTitle}', '${answer.salaryAmount}', '${answer.departmentId}')`,
    function (err, res) {
      if (err) throw err;
      console.log("A New Role Has Been Successfully Added!" + "\n");
      console.log(answer.roleTitle + " " + answer.salaryAmount + " " + answer.departmentId + "\n");
      viewAllRoles();
    });
  });
};

// Add Department
function addDepartment() {
  inquirer.prompt ([
    {
      type: "input",
      name: "add_department",
      message: "What 'Department' would you like to add?"
    },
  ]).then (function(answer) {
    connection.query(`INSERT INTO department (name) VALUES ('${answer.add_department}')`,
    function(err, res) {
      if (err) throw err;
      console.log("A New Department Has Been Successfully Added!" + "\n");
      console.log(answer.add_department + "\n");
      viewAllDepartments();
    });
  });
}

// Update
function updateEmployee() {
  inquirer.prompt([
  {
    type: "input",
    name: "employeeName",
    message: "Enter the 'First Name' of the employee you would like to update:"
  },
  {
    type: "input",
    name: "roleId",
    message: "Enter the 'Role ID' of the employee you would like to update:"
  },
  ]).then(function(answer) {
    connection.query(`UPDATE employee SET role_id = '${answer.roleId}' WHERE first_name = '${answer.employeeName}'`,
    function (err, res) {
    if (err) throw err;
    console.log("Successfully Updated Employee's Information" + "\n");
    });
  viewAllEmployees();
  });
};

// Delete Employee Function
function deleteEmployee() { 
  inquirer.prompt([
    {
      name: "employeeDelete",
      type: "input",
      message: "Enter the employee's 'First Name' you would like to remove:"
    },
  ]).then(function(answer) {
    connection.query(`DELETE FROM employee WHERE first_name = '${answer.employeeDelete}';`,
    function(err, res){
      if (err) throw err;
      console.log ("The employee has been successfully deleted" + "\n");
    });
    viewAllEmployees();
  });
};