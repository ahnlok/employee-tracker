// Dependencies
const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');
const figlet = require("figlet");

let employees;
let roles;
let departments;
let manager;

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
    viewAllEmployees();
    viewAllRoles();
    viewAllDepartments();
});

// Starting Prompt
function init() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "VIEW",
              "ADD",
              "UPDATE",
              "DELETE",
              "EXIT"
            ]
    }
]).then(function(val) {
  if (val === "VIEW") {
    viewChoice();
  }
  else if (val === "ADD") {
    addChoice();
  }
  else if (val === "UPDATE") {
    updateChoice();
  }
  else if (val === "DELETE") {
    deleteEmployee();
  }
  else {
    connection.end();
    }
  })
}

// View Choice
function viewChoice() {
  inquirer.prompt([
    {
    name: "viewSelection",
    type: "list",
    message: "What would you like to view?",
    choices: ["View Employees", "View Roles", "View Departments", "EXIT"]
    },
  ]).then(function(answer) {
    if (answer.viewSelection === "View Employees") {
      viewAllEmployees();
    }
    else if (answer.viewSelection === "View Roles") {
      viewAllRoles();
    }
    else if (answer.viewSelection === "View Department") {
      viewAllDepartments();
    }
    else {
      connection.end();
    }
  })
}

//View Employee
function viewAllEmployees() {
    connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", 
    (err, res) => {
    // employees = res;
    if (err) throw err
    console.table(res)
    init()
  })
}

// View Roles
function viewAllRoles() {
  connection.query("SELECT id, title FROM role", 
  (err, res) => {
  // roles = res;
  if (err) throw err
  console.table(res)
  init()
  })
}
// View Department
function viewAllDepartments() {
  connection.query("SELECT id, name FROM department", 
  (err, res) =>{
    if (err) throw err
    console.table(res)
    init()
  })
}

// Select Role Prompt
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}
// The Manager Prompt
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}
// Adding Employee
function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          init()
      })

  })
}

// Update Employee
  function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(val) {
        var roleId = selectRole().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            init()
        })
  
    });
  });

  }
//============= Add Employee Role ==========================//
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                init();
            }
        )

    });
  });
  }
//============= Add Department ==========================//
function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                init();
            }
        )
    })
  }


