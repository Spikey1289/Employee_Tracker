const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
require('dotenv').config();

async function main() {
        //connects to the local database if the .env file was filled out correctly
        const db = await mysql.createConnection({
            host: process.env.HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

    let keepGoing = true;
    let answer = {};
    let dbResponse = {};

    // the main loop of the program, if keepgoing is false (which it is set to in the 'quit' case), the loop (application) stops running.
    while (keepGoing) {
        let input;
        let managers;
        let Roles;

        // prompts the user for what they want to do with the database/tables
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

            //the heart of the program, responds to the above prompt by making sql queries for the corresponding information or edits
            switch (answer.choice) {
                // uses an sql select query to log a table of departments in the console
                case 'view departments':
                    try{
                        dbResponse = await db.query('SELECT * from department;');
                        console.table(dbResponse[0]);
                    } catch (err) {
                        console.log(err);
                    }
                    break;

                //uses an sql select/join to log a table of roles in the console
                case 'view roles':

                    try {
                        dbResponse = await db.query(
                            `select
                                role.id,
                                role.title,
                                role.salary,
                                department.name
                            from role
                            join department on role.dep_id = department.id
                            ORDER BY ID;`
                        );
                        console.table(dbResponse[0]);
                    } catch (err){
                        console.log(err);
                    }

                    break;

                //uses an sql select/left join to log a table of employees in the console
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
                        left join employees b on a.manager_id = b.id
                        ORDER BY ID;`
                    );
                    console.table(dbResponse[0]);
                    break;

                //uses an inquirer.prompt to get the name of the department, then an sql query to insert the new department into the table
                case 'add a department':
                    // inquirer.prompt to get the name of the department
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

                    // sql query to insert the new department into the table
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

                /*
                calls the database to get the name of a department, 
                then uses an inquirer.prompt to get the name of the role, its pay, and which department it's in,
                then uses an sql query to change the department to its corresponding department.id for the database,
                finally uses a sql query to insert the new role into the table.
                */
                case 'add a role':
                    // variable to store the user input
                    input = {};

                    //query to get the department names from the database for use in assigning only the available databases to the department category
                    try{
                        dbResponse = await db.query(
                            `SELECT department.name From department;`
                        );
                        dbResponse = dbResponse[0].map(value => value.name);
                    } catch (err) {
                        console.log(err);
                    }

                    // inquirer.prompt to get the name of the role, its pay, and which department it's in
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

                    // sql query to change the department to its corresponding department.id for the database
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

                    // sql query to insert the new role into the table.
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

                /*
                queries the database to get the list of managers,
                then queries the database to get the list of roles,
                then uses an inquirer.prompt to get the first name, last name, role, and manager (if they have one) of the new employee,
                then uses a simple reassignment to make an input null if none was selected for manager,
                then uses two queries to change the names of the roles and managers from the users input to their corresponding ids in the database,
                finally, uses a query to insert the formatted input into the database.
                */
                case 'add an employee':
                    input = null;
                    role = null;
                    managers = null;
                    
                    //  queries the database to get the list of managers
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

                    // queries the database to get the list of roles
                    try {
                        Roles = await db.query(
                            `SELECT role.title From role;`
                        );
                        Roles = Roles[0].map(value => value.title);
                    } catch (err) {
                        console.log(err);
                    }
                    
                    // then uses an inquirer.prompt to get the first name, last name, role, and manager(if they have one) of the new employee
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
                                    choices: Roles
                                },
                                {
                                    type: 'list',
                                    name: 'Manager',
                                    message: 'please choose the manager of this employee, if they have one',
                                    choices: managers
                                }
                            ]);
                        // simple reassignment to make an input null if none was selected for manager
                        if (input.Manager === 'none') {
                            input.Manager = 'NULL';
                        }
                    } catch (err) {
                        console.log(err);
                    }

                    // query to change the name of the role from the users input to its corresponding id in the database
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

                    // query to change the name of the manager from the users input to its corresponding id in the database
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

                    // query to insert the formatted input into the database
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

                /*
                queries the database to get the list of employees for the user to choose from to update,
                then inquirer.prompt's the user to chose an employee to update (the name and id of the employee is saved in 2 variables)
                then queries the database for all of the relevant data from the employees table to display for the user,
                then queries the database for all the managers the user can chose from,
                then queries the database for all the roles the user can chose from,
                then inquirer.prompt's the user to change the first name, last name, role, and manager. 
                    if the field is left blank or if '---' is chosen, the corresponding section is unchanged (e.g.: if the last name changed but the first name didn't),
                then uses a simple reassignment to make an input null if none was selected for manager,
                then uses an if() to change the selected manager to their manager_id to input into the database. leaves it as null if none was chosen or unchanged if '---' was chosen.
                then uses an if() to change the selected role to their role_id to input into the database. leaves it unchanged if '---' was chosen.
                then uses a series of if() statements to check if a field was left blank, or if it was changed. If the field was changed, then it is updated with a query.
                finally, puts out a message saying what was changed during the update.
                */
                case 'update an employee':
                    input = null;
                    managers = null;
                    Roles = null;
                    let employeeUpdate = null;
                    let employeeID = null;
                    let message = ``;

                    // queries the database to get the list of employees for the user to choose from to update
                    try {
                        dbResponse = await db.query(
                           `select concat(employees.first_name, ' ', employees.last_name) as employee
                            from employees;`
                        ); 
                        dbResponse = dbResponse[0].map(value => value.employee);
                    } catch(err) {
                        console.log(err);
                    }

                    // inquirer.prompt's the user to chose an employee to update, and saves the employees full name for future use
                    try {
                        employeeUpdate = await inquirer
                            .prompt(
                                {
                                    type: 'list',
                                    name: 'EmployeeChoice',
                                    message: 'Select an employee to update',
                                    choices: dbResponse
                                }
                            ); 
                        employeeUpdate = employeeUpdate.EmployeeChoice;
                        message = `${employeeUpdate}'s`;
                    } catch(err) {
                        console.log(err);
                    }

                    // saves the employee id for later use
                    try {
                        employeeID = await db.query(
                            `select id
                            from employees
                            where concat(employees.first_name, ' ', employees.last_name) = '${employeeUpdate}';`
                        )
                        employeeID = employeeID[0][0].id
                    } catch (err) {

                    }

                    //queries the database for all of the relevant data from the employees table to display for the user
                    try {
                        dbResponse = await db.query(
                            `select * from employees
                            where concat(employees.first_name, ' ', employees.last_name) = '${employeeUpdate}';`
                        );
                        dbResponse = dbResponse[0];
                        console.table(dbResponse);
                    } catch(err) {
                        console.log(err);
                    }

                    // queries the database for all the managers the user can chose from
                    try {
                        managers = await db.query(
                            `select distinct IFNULL(concat(b.first_name, ' ', b.last_name), 'none') as manager
                                from employees a
                            left join employees b on a.manager_id = b.id;`
                        );
                        managers[0].unshift({ manager: '---' });
                        managers = managers[0].map(value => value.manager);
                    } catch (err) {
                        console.log(err);
                    }

                    // queries the database for all the roles the user can chose from
                    try {
                        Roles = await db.query(
                            `SELECT role.title From role;`
                        );
                        Roles[0].unshift({ title: '---' });
                        Roles = Roles[0].map(value => value.title);
                    } catch (err) {
                        console.log(err);
                    }
                    
                    // prompts the user to change the first name, last name, role, and manager
                        // if the field is left blank or if '---' is chosen, the corresponding section is unchanged
                    try {
                        input = await inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'FirstName',
                                    message: 'please enter the updated First Name (enter nothing if unchanged)'
                                },
                                {
                                    type: 'input',
                                    name: 'LastName',
                                    message: 'please enter the updated Last Name (enter nothing if unchanged)'
                                },
                                {
                                    type: 'list',
                                    name: 'Role',
                                    message: 'Please choose the updated Role (--- if unchanged)',
                                    choices: Roles
                                },
                                {
                                    type: 'list',
                                    name: 'Manager',
                                    message: 'please choose the updated manager of this employee, if they have one (--- if unchanged)',
                                    choices: managers
                                }
                            ]);
                        // a simple reassignment to make an input null if none was selected for manager
                        if (input.Manager === 'none') {
                            input.Manager = 'NULL';
                        }
                    } catch(err) {
                        console.log(err);
                    }

                    // changes the selected manager to its manager_id to input into the database. leaves it as null if none was chosen or unchanged if '---' was chosen.
                    if (input.Manager !== 'NULL' && input.Manager !== '---') {
                        try {
                            dbResponse = await db.query(
                                `select employees.id
                                    from employees
                                where concat(employees.first_name, ' ', employees.last_name) = '${input.Manager}';`
                            )
                            input.Manager = dbResponse[0][0].id;
                        } catch (err) {
                        console.log(err);
                        }
                    }
                    
                    // changes the selected role to its role_id to input into the database. leaves it unchanged if '---' was chosen.
                    if (input.Role !== '---') {
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
                    }

                    // a series of if() statements to check if a field was left blank, or if it was changed. If the field was changed, then it is updated with a query.
                    try{
                        // checks if the first name was changed, and updates it if first name was changed
                        if (input.FirstName !== '') {
                            await db.query(
                                `update employees
                                    set first_name = "${input.FirstName}"
                                where employees.id = ${employeeID};`
                            );
                            message += ` First Name`
                        }
                        // checks if the last name was changed, and updates it if last name was changed
                        if (input.LastName !== '') {
                            await db.query(
                                `update employees
                                    set last_name = "${input.LastName}"
                                where employees.id = ${employeeID};`
                            );
                            message += ` Last Name`
                        }
                        // checks if the role was changed, and updates it if role was changed
                        if (input.Role !== '---') {
                            await db.query(
                                `update employees
                                    set role_id = "${input.Role}"
                                where employees.id = ${employeeID};`
                            );
                            message += ` Role`
                        }
                        // checks if the manager was changed, and updates it if manager was changed
                        if (input.Manager !== '---') {
                            await db.query(
                                `update employees
                                    set manager_id = "${input.Manager}"
                                where employees.id = ${employeeID};`
                            );
                            message += ` Manager`
                        }
                        // if nothing was changed, updates the end message to reflect that nothing was changed
                        if (input.FirstName !== '' && input.LastName !== '' && input.Role !== '---' && input.Manager !== '---') {
                            message += ` were/was updated.`;
                        } else {
                            message += ` profile was not updated, as nothing has changed`;
                        }
                        console.log(message);
                    } catch(err) {
                        console.log(err);
                    }

                    break;

                // ends the loop that is generating the choices for the user to chose from
                case 'quit':
                    keepGoing = false;
                    break;
            }
        }
        // closes the database
    db.end();
}

//runs the main function
main();