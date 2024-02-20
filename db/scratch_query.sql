-- join for view employees
select 
    a.id,
    a.first_name,
    a.last_name,
    IFNULL(concat(b.first_name, ' ', b.last_name), '---') as manager,
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
select *
from department;

-- sql for adding departments
insert into department (name)
    VALUES ('Research and Development');

SELECT * From department;

-- sql for adding roles
insert into role (title, salary, dep_id)
    VALUES ('CEO', 200000, 1);

-- sql for getting department id from inputted department name
select department.id
from department
where department.name = 'Development';

-- sql for adding employees
insert into employees (first_name, last_name, role_id, manager_id)
    VALUES('john', 'doe', 3, null);

-- sql for updating an employee
update employees
set first_name = "Alice", last_name = "Hammer", role_id = 1, manager_id = NULL
where id = 1;

select distinct IFNULL(concat(b.first_name, ' ', b.last_name), 'none') as manager

from employees a

left join employees b on a.manager_id = b.id;

select employees.id
from employees
where concat(employees.first_name, ' ', employees.last_name) = 'Alice Hammer';