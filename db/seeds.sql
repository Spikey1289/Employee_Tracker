-- populates the tables of the database
-- populate department table
INSERT INTO department(name)
    VALUES 
        ('Development'),
        ('QA Testing'),
        ('Customer Support'),
        ('Design');

-- populate role table
INSERT INTO role(title, salary, dep_id)
    VALUES
        ('Dev Manager', 35000.00, 1),
        ('Dev Team Head', 25000.00, 1),
        ('Dev Full-time', 20000.00, 1),
        ('Dev Part-time', 10000.00, 1),

        ('QA Manager', 35000.00, 2),
        ('QA Team Head', 25000.00, 2),
        ('QA Full-time', 20000.00, 2),
        ('QA Part-time', 10000.00, 2),

        ('CS Manager', 35000.00, 3),
        ('CS Team Head', 25000.00, 3),
        ('CS Full-time', 20000.00, 3),
        ('CS Part-time', 10000.00, 3),

        ('Design Manager', 35000.00, 4),
        ('Design Team Head', 25000.00, 4),
        ('Design Full-time', 20000.00, 4),
        ('Design Part-time', 10000.00, 4);

-- populate employees table
INSERT INTO employees(first_name, last_name, role_id, manager_id)
    VALUES
        ('Alice', 'Hammer', 1, NULL),
        ('Ted', 'Lasso', 2, 1),
        ('Ronald', 'Mcdonald', 3, 2),
        ('Savanah', 'XYZ', 3, 2),

        ('Buzz', 'Lightyear', 5, NULL),
        ('Will', 'Farel', 6, 5),
        ('Screen', 'Cleaner', 7, 6),
        ('Pecan', 'Pie', 8, 6),

        ('Arnold', 'Schwarzenegger', 9, NULL),
        ('Online', 'Bootcamp', 10, 9),
        ('John', 'Connor', 11, 10),
        ('Slide', 'Lock', 11, 10),
        ('Revenge', 'Cold', 11, 10),

        ('Johnny', 'Test', 13, NULL),
        ('The', 'Beatles', 14, 13),
        ('IPhone', 'Five', 15, 14),
        ('Nirvana', 'Doe', 16, 14),
        ('Walter', 'White', 16, 14);


SELECT DATABASE();

SHOW tables;

SELECT * from department;
SELECT * from role;
SELECT * from employees;