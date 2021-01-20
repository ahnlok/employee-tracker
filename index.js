const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Ahn@lok123",
    database: "employee_DB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to Employee-Tracker!");
    start();
});

// Function to bring out start prompts
function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "userChoice",
            choices: [
                "View all employees",
                "View all employees by 'Role'",
                "View all employees by 'Department'",
                "View all employees by 'Manager'",
                "Add employee",
                "Add role",
                "Add department",
                "Update employee",
                "Delete employee",
                "Exit"
                ],
        },
    ]).then(function(answer) {
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

            case "Delete employee":
                deleteEmployee();
            break;

            case "Add role":
                addRole();
            break;

            case "Add department":
                addDepartment();
            break;
            
            default: 
                exit();
            break;
        }
    })
}

// Viewing all employees
function viewEmployee() {
    const queryString = `"SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";`; 
    connection.query(queryString, function(err, res) {
      if (err) throw err
      console.table(res)
      start()
  })
}

// View Role
function viewRole() {
    const roleArr = [];
    const queryString = `SELECT title FROM role`;
    connection.query(queryString, function(err, res) {
        if (err) throw err
        console.table(res)
        start()
    })
}

// View Department
function viewDepartment() {
    const queryString =`SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;`;
    connection.query(queryString, function(err, res) {
        if (err) throw err
        console.table(res)
        start()
    })
}

// Select Role Title for Add Employee Prompt
var roleArr = [];
function selectRole() {
    const queryString = `SELECT * FROM role`
    connection.query(queryString, function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  })
  return roleArr;
}

// Select Managers for Add Employee Prompt
var managersArr = [];
function selectManager() {
    const queryString = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;`;
    connection.query(queryString, function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }
  })
  return managersArr;
}

// Add Employee
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
        },
    ]).then(function (val) {
      const roleId = selectRole().indexOf(val.role) + 1
      const managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  })
}

// Update Employee
  function updateEmployee() {
    const queryString = `SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;`;
    connection.query(queryString, function(err, res) {
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
            startPrompt()
        })
  
    });
  });

}
// Add Role
function addRole() { 
    const queryString = `SELECT role.title AS Title, role.salary AS Salary FROM role;`;
  connection.query(queryString,   function(err, res) {
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
                startPrompt();
            }
        )

    });
  });
}
// Add Department
function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        },
    ]).then(function(res) {
        connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                start();
            }
        )
    })
  }


