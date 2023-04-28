const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
const { userMenu, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./index.js');

// Express middleware to handle JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
