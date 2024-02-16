-- join for employees
select 
    a.id,
    a.first_name,
    a.last_name,
    IFNULL(b.first_name, '---') as manager,
    role.title as role,
    role.salary
from employees a

join role on a.role_id = role.id
left join employees b on a.manager_id = b.id
where a.manager_id is null or b.id is not null;

-- join for role
select 
    role.id,
    role.title,
    role.salary,
    department.name
from role
join department on role.dep_id = department.id;