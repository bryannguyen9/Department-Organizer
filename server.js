const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./index.js');

// Express middleware to handle JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
