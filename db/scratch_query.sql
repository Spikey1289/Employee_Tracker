-- join for view employees
select 
    a.id,
    a.first_name,
    a.last_name,
    IFNULL(b.first_name, '---') as manager,
    role.title as role,
    role.salary
from employees a

join role on a.role_id = role.id
left join employees b on a.manager_id = b.id;

-- join for view role
select 
    role.id,
    role.title,
    role.salary,
    department.name
from role
join department on role.dep_id = department.id;

-- sql for view departments
select
    department.id,
    department.name
from department;

-- sql for adding departments
insert into department (name)
    VALUES ('Research and Development');

SELECT * From department;

-- sql for adding roles
insert into role (title, salary, dep_id)
    VALUES ('CEO', 200000, 1);

-- sql for adding employees
insert into employees (first_name, last_name, role_id, manager_id)
    VALUES('john', 'doe', 3, null);

-- sql for updating an employee
update employees
set first_name = "Alice", last_name = "Hammer", role_id = 1, manager_id = NULL
where id = 1;