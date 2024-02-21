-- Deletes Company_Employees if exists
DROP DATABASE IF EXISTS Company_Employees;

-- creates new db Company_Employees
CREATE DATABASE Company_Employees;

-- switch to Company_Employees
USE Company_Employees;

-- creates the departments table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT, -- 1
    name VARCHAR(30),
    PRIMARY KEY (id)
);

-- creates the role table
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,        -- 2
    title VARCHAR(30),
    salary DECIMAL,
    dep_id INT,             -- *1
    PRIMARY KEY (id),
    FOREIGN KEY (dep_id) REFERENCES department(id) ON DELETE SET NULL
);

-- creates the employees table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,    -- 3 -- *3
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,            -- *2
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);


-- shows the database in use (Company_Employees)
SELECT DATABASE();

SHOW tables;

SELECT * from department;
SELECT * from role;
SELECT * from employees;