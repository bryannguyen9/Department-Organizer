-- Insert department data
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');

-- Insert roles data
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Lead', 100000, 1),
  ('Salesperson', 50000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Accountant', 125000, 3),
  ('Finance Manager', 150000, 3);

-- Insert employee data
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('David', 'Chung', 1, NULL),
  ('Jonathan', 'Borroel', 2, 1),
  ('David', 'Vo', 2, 1),
  ('Kenneth', 'Cruz', 3, NULL),
  ('Jedd', 'Javier', 4, 3),
  ('Sarah', 'Park', 4, 3),
  ('Bryan', 'Nguyen', 5, NULL),
  ('Austin', 'Nguyen', 6, 5);