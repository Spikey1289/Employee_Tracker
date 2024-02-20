const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
require('dotenv').config();
require('./assets/classes');

async function main() {
        const db = await mysql.createConnection({
            host: process.env.HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

    let keepGoing = true;
    let answer = {};
    let dbResponse = {};
    while (keepGoing) {
        let input = null;
        try{
            answer = await inquirer
                .prompt(
                    {
                        type: 'list',
                        name: 'choice',
                        message: '',
                        choices: ['view departments', 'view roles', 'view employees', 'add a department', 'add a role', 'add an employee', 'update an employee', 'quit']
                    }
                )
        } catch (err){
            console.log(err);
        }

            switch (answer.choice) {
                case 'view departments':
                    try{
                        dbResponse = await db.query('SELECT * from department;');
                        console.table(dbResponse[0]);
                    } catch (err) {
                        console.log(err);
                    }
                    break;

                case 'view roles':

                    try {
                        dbResponse = await db.query(
                            `select
                            role.id,
                            role.title,
                            role.salary,
                            department.name
                        from role
                        join department on role.dep_id = department.id;`);
                        console.table(dbResponse[0]);
                    } catch (err){
                        console.log(err);
                    }

                    break;


                case 'view employees':
                    dbResponse = await db.query(
                    `select 
                        a.id,
                        a.first_name,
                        a.last_name,
                        IFNULL(b.first_name, '---') as manager,
                        role.title as role,
                        role.salary
                    from employees a
                    join role on a.role_id = role.id
                    left join employees b on a.manager_id = b.id;`);
                    console.table(dbResponse[0]);
                    break;


                case 'add a department':
                    try{
                        input = await inquirer
                            .prompt(
                                {
                                    type: 'input',
                                    name: 'department',
                                    message: 'please enter a new department name:'
                                }
                            );
                        input = input.department;
                    } catch (err){
                        console.log(err);
                    }

                    try {
                        await db.query(
                            `insert into department (name)
                                VALUES ('${input}');`
                        );
                        console.log(`department '${input}' added`);
                    } catch(err) {
                        console.log(err);
                    }
                    break;


                case 'add a role':
                    input = {};
                    try{
                        dbResponse = await db.query(
                            `SELECT department.name From department;`
                        );
                        dbResponse = dbResponse[0].map(value => value.name);
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        input = await inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'Title',
                                    message: 'please enter the title of the role you wish to add'
                                },
                                {
                                    type: 'input',
                                    name: 'Salary',
                                    message: 'please enter the salary of this role'
                                },
                                {
                                    type: 'list',
                                    name: 'Department',
                                    message: 'please choose the department you wish to add this role to',
                                    choices: dbResponse
                                }
                            ]);
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        dbResponse = await db.query(
                            `select department.id
                            from department
                            where department.name = '${input.Department}';`
                        )
                        input.Department = dbResponse[0][0].id;
                    } catch (err){
                        console.log(err);
                    }

                    try{
                        await db.query(
                            `insert into role (title, salary, dep_id)
                                VALUES ('${input.Title}', '${input.Salary}', '${input.Department}');`
                        );
                        console.log('New Role Added');
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'add an employee':
                    input = {};
                    let managers;

                    try {
                        managers = await db.query(
                            `select distinct IFNULL(concat(b.first_name, ' ', b.last_name), 'none') as manager
                                from employees a
                            left join employees b on a.manager_id = b.id;`
                        );
                        managers = managers[0].map(value => value.manager);
                    } catch(err) {
                        console.log(err);
                    }

                    try {
                        dbResponse = await db.query(
                            `SELECT role.title From role;`
                        );
                        dbResponse = dbResponse[0].map(value => value.title);
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        input = await inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'FirstName',
                                    message: 'please enter the First name of the employee you wish to add'
                                },
                                {
                                    type: 'input',
                                    name: 'LastName',
                                    message: 'please enter the Last name of the employee you wish to add'
                                },
                                {
                                    type: 'list',
                                    name: 'Role',
                                    message: 'please choose the role of this employee',
                                    choices: dbResponse
                                },
                                {
                                    type: 'list',
                                    name: 'Manager',
                                    message: 'please choose the manager of this employee, if they have one',
                                    choices: managers
                                }
                            ]);
                        if (input.Manager === 'none') {
                            input.Manager = 'NULL';
                        }
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        dbResponse = await db.query(
                            `select role.id
                            from role
                            where role.title = '${input.Role}';`
                        )
                        input.Role = dbResponse[0][0].id;
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        if(input.Manager !== 'NULL'){
                            dbResponse = await db.query(
                                `select employees.id
                                from employees
                                where concat(employees.first_name, ' ', employees.last_name) = '${input.Manager}';`
                            )
                            input.Manager = dbResponse[0][0].id;
                        }
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        await db.query(
                            `insert into employees(first_name, last_name, role_id, manager_id)
                                VALUES('${input.FirstName}', '${input.LastName}', ${input.Role}, ${input.Manager});`
                        );
                        console.log('added Employee');
                    } catch(err) {
                        console.log(err);
                    }
                    break;

                case 'update an employee':
                    input = {};
                    managers =[];
                    
                    try {
                        managers = await db.query(
                            `select distinct IFNULL(concat(b.first_name, ' ', b.last_name), 'none') as manager
                                from employees a
                            left join employees b on a.manager_id = b.id;`
                        );
                        managers = managers[0].map(value => value.manager);
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        dbResponse = await db.query(
                            `SELECT role.title From role;`
                        );
                        dbResponse = dbResponse[0].map(value => value.title);
                    } catch (err) {
                        console.log(err);
                    }

                    break;

                case 'quit':
                    keepGoing = false;
                    break;
            }
        }
        db.end();
    }

main();