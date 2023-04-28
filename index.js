const inquirer = require('inquirer');


// Inquirer prompts for user input
function userMenu() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'option',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit', // Add an option to exit the app
          ],
        },
      ])
      .then((answer) => {
        switch (answer.option) {
          case 'View all departments':
            viewAllDepartments().then(() => userMenu());
            break;
          case 'View all roles':
            viewAllRoles().then(() => userMenu());
            break;
          case 'View all employees':
            viewAllEmployees().then(() => userMenu());
            break;
          case 'Add a department':
            addDepartment()
              .then(() => console.log('Department added.'))
              .then(() => userMenu());
            break;
          case 'Add a role':
            addRole()
              .then(() => console.log('Role added.'))
              .then(() => userMenu());
            break;
          case 'Add an employee':
            addEmployee()
              .then(() => console.log('Employee added.'))
              .then(() => userMenu());
            break;
          case 'Update an employee role':
            updateEmployeeRole()
              .then(() => console.log('Employee role updated.'))
              .then(() => userMenu());
            break;
          case 'Exit': // Exit the loop and terminate the app
            console.log('Goodbye!');
            process.exit();
            break;
          default:
            console.log('Invalid option.');
            userMenu();
            break;
        }
      });
    }

  function addEmployee() {
    inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: function() {
          // Query the database for all roles and return them as choices
          return getRoles();
        }
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: function() {
          // Query the database for all employees and return them as choices
          return getEmployees();
        }
      }
    ])
    .then(function(answer) {
      // Get the role ID from the role name
      var roleId = getRoleId(answer.role);
      // Get the manager ID from the manager name
      var managerId = getManagerId(answer.manager);
      // Add the employee to the database
      addEmployeeToDatabase(answer.first_name, answer.last_name, roleId, managerId);
      console.log("Employee added successfully!");
      userMenu(); // Add this line to go back to the main menu after adding an employee
    });
  }
  
  // Function to update an employee's role
  function updateEmployeeRole() {
    inquirer.prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee do you want to update?",
        choices: function() {
          // Query the database for all employees and return them as choices
          return getEmployees();
        }
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's new role?",
        choices: function() {
          // Query the database for all roles and return them as choices
          return getRoles();
        }
      }
    ])
    .then(function(answer) {
      // Get the employee ID from the employee name
      var employeeId = getEmployeeId(answer.employee);
      // Get the role ID from the role name
      var roleId = getRoleId(answer.role);
      // Update the employee's role in the database
      updateEmployeeRoleInDatabase(employeeId, roleId);
      console.log("Employee role updated successfully!");
      userMenu();
    });
  }
  
  // Function to view all departments
  function viewAllDepartments() {
    const sql = `SELECT * FROM department`;
  
    return db.promise().query(sql)
      .then(([rows]) => {
        console.table(rows);
      })
      .catch((err) => console.error(err));
  }
  
  // Function to view all roles
  function viewAllRoles() {
    // Query the database for all roles and display them in a formatted table
    const sql = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        return Promise.resolve();
        
      });
      userMenu();
}
  
  // Function to view all employees
  function viewAllEmployees() {
    // Query the database for all employees and display them in a formatted table
    const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return Promise.resolve();
  });
  userMenu();
}
  
  // Function to add a department
  function addDepartment() {
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department?"
      }
    ])
    .then(function(answer) {
      // Add the department to the database
      addDepartmentToDatabase(answer.name);
      console.log("Department added successfully!");
      userMenu();
    });
  }
  
  // Function to add a role
  function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter the name of the role:',
          name: 'title',
        },
        {
          type: 'input',
          message: 'Enter the salary for the role:',
          name: 'salary',
        },
        {
          type: 'list',
          message: 'Select the department for the role:',
          name: 'department',
          choices: getDepartments(),
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO roles SET ?',
          {
            title: answers.title,
            salary: answers.salary,
            department_id: getDepartmentIdByName(answers.department),
          },
          (err, res) => {
            if (err) throw err;
            console.log(`Role '${answers.title}' added successfully!`);
            userMenu();
          }
        );
      });
  }

  function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter the employee\'s first name:',
          name: 'first_name',
        },
        {
          type: 'input',
          message: 'Enter the employee\'s last name:',
          name: 'last_name',
        },
        {
          type: 'list',
          message: 'Select the employee\'s role:',
          name: 'role',
          choices: getRoles(),
        },
        {
          type: 'list',
          message: 'Select the employee\'s manager:',
          name: 'manager',
          choices: getManagers(),
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO employees SET ?',
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: getRoleIdByName(answers.role),
            manager_id: getManagerIdByName(answers.manager),
          },
          (err, res) => {
            if (err) throw err;
            console.log(`Employee '${answers.first_name} ${answers.last_name}' added successfully!`);
            userMenu();
          }
        );
      });
  }

  function updateEmployeeRole() {
    connection.query('SELECT * FROM employees', (err, res) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: 'list',
            message: 'Select the employee to update:',
            name: 'employee',
            choices: res.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            type: 'list',
            message: 'Select the employee\'s new role:',
            name: 'role',
            choices: getRoles(),
          },
        ])
        .then((answers) => {
          connection.query(
            'UPDATE employees SET ? WHERE ?',
            [
              {
                role_id: getRoleIdByName(answers.role),
              },
              {
                id: answers.employee,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(`Employee's role updated successfully!`);
              userMenu();
            }
          );
        });
    });
  }

  module.exports = {
    userMenu,
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment, 
    addRole,
    addEmployee, 
    updateEmployeeRole   
}