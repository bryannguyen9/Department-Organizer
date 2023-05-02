const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the database.');
    // start app
    userMenu();
  });
  
  // Inquirer prompts for user input
  const userMenu = () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'option',
          loop: false,
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
            viewAllDepartments();
            break;
          case 'View all roles':
            viewAllRoles();
            break;
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'Add a department':
            addDepartment()
            break;
          case 'Add a role':
            addRole()
            break;
          case 'Add an employee':
            addEmployee()
            break;
          case 'Update an employee role':
            updateEmployee()
            break;
          case 'Exit': // Exit the loop and terminate the app
            console.log('Goodbye!');
            db.end();
            break;
          default:
            console.log('Invalid option.');
            userMenu();
            break;
        }
    });
}

const viewAllDepartments = () => {
  db.query('SELECT * FROM department', function (err, res) {
    if (err) throw err;
    console.table(res);
    userMenu();
  });
};

const viewAllRoles = () => {
  db.query('SELECT * FROM role', function (err, res) {
    if (err) throw err;
    console.table(res);
    userMenu();
  });
};

const viewAllEmployees = () => {
  db.query(
    'SELECT employee.id, first_name, last_name, title, salary, name, manager_id FROM ((department JOIN role ON department.id = role.department_id) JOIN employee ON role.id = employee.role_id);',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      userMenu();
    }
  );
};

let addDepartment = () => {
  inquirer.prompt([
      {
        name: 'department',
        type: 'input',
        message: 'What is the department name?',
      }
    ])
    .then((answer) => {
      console.log(answer);
      db.query(
        'INSERT INTO department (name) VALUES (?)',
        [answer.department],
        function (err, res) {
          if (err) {
            throw err;
          };
          console.log('Department added!');
          userMenu();
        }
      );
    });
};

const addRole = () => {
  inquirer.prompt([
      {
        name: 'roleTitle',
        type: 'input',
        message: 'What is the role title?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this job?',
      },
      {
        name: 'deptId',
        type: 'input',
        message: 'What is the department ID number?',
      },
    ])
    .then(answer => {
      db.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [answer.roleTitle, answer.salary, answer.deptId],
        function (err, res) {
          if (err) throw err;
          console.log('Role added!');
          userMenu();
        }
      );
    });
};

const addEmployee = () => {
  inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: "What is the employee's first name?",
      },
      {
        name: 'lastName',
        type: 'input',
        message: "What is the employee's last name?",
      },
      {
        name: 'roleId',
        type: 'input',
        message: "What is the employee's role id?",
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'What is the manager Id?',
      },
    ])
    .then(answer => {
      db.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
        function (err, res) {
          if (err) throw err;
          console.log('Employee added!');
          userMenu();
        }
      );
    });
};

const updateEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'Enter employee id',
      },
      {
        name: 'newRoleId',
        type: 'input',
        message: 'Enter new role id',
      },
    ])
    .then(answer => {
      db.query(
        'UPDATE employee SET role_id=? WHERE id=?',
        [answer.newRoleId, answer.id],
        function (err, res) {
          if (err) throw err;
          console.log('Employee updated!');
          userMenu();
        }
      );
    });
};


    
