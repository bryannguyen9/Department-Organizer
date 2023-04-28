const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Create a MySQL connection
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'bryannguyen9',
    password: 'password',
    database: 'company_db'
  });
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the database.');
  });

// Express middleware to handle JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
        'Update an employee role'
      ]
    }
  ])
  .then(answer => {
    switch (answer.option) {
      case 'View all departments':
        // Function call to view all departments
        break;
      case 'View all roles':
        // Function call to view all roles
        break;
      case 'View all employees':
        // Function call to view all employees
        break;
      case 'Add a department':
        // Function call to add a department
        break;
      case 'Add a role':
        // Function call to add a role
        break;
      case 'Add an employee':
        // Function call to add an employee
        break;
      case 'Update an employee role':
        // Function call to update an employee role
        break;
      default:
        console.log('Invalid option.');
        break;
    }
  });