# Employee_Tracker

## Introduction
This is the README for the Employee Tracker challenge of my coding bootcamp. This Repository contains an JS file, along with SQL files that are used in an application that manages an imitation of an employee database.

## Things Learned
Through this challenge, I was able to learn how to use SQL and MYSQL2/MYSQL2-Promise to make an application that can edit tables in a database.

### THIS APPLICATION ASSUMES THAT YOU ALREADY HAVE INSTALLED MYSQL SERVER
If you do not have mysql installed, or have not set up your MYSQL root password, or have not set up a user/password combo, this application will not work as advertised. If you need to install and set up mysql server, click on this [download link](https://dev.mysql.com/downloads/mysql/), and follow a guide to set up mysql server and set up the legacy authentication.

### Application Walkthrough

- After downloading the application files, you're going to need to install node js, inquirer, and MYSQL2/Promise.
    - to install node: follow this [link](https://nodejs.org/en/download/package-manager) and follow the directions
    - you should only need to then run '`npm i`' in your terminal then, however if the application does not work follow these directions:
        - to install inquirer: after you have node installed, type '`npm install --save inquirer`' in your integrated terminal.
        - to install MYSQL2: after you have node installed, type '`npm install mysql2 --save`' in your integrated terminal
        - to install MYSQL2-promise: after you have node installed, type '`npm install mysql2-promise --save`' in your integrated terminal.
        - to install dotenv: after you have node installed, type '`npm install dotenv`' in your integrated terminal.
- After the above steps are completed, you are going to have to log into MYSQL2 in the terminal (mysql -u root -p), then enter your password.
- Next, Please find the .env.EDIT_ME file, and edit the DB_USER and DB_PASSWORD to be your MySQL root and root password, then rename the file to '.env'.
    - please MAKE SURE TO FOLLOW THE ABOVE STEP, I didn't do it during the tutorial because I already have one in my project folder that has not been pushed up to github, but if you don't fill it out correctly the application WILL NOT RUN!
- After you have logged into your MySQL shell and edited the .env file, run the following commands:
    - source db/schema.sql
    - source db/seeds.sql
- A database of employees should have been created for the index.js to alter, the tables should display in your terminal once they have been made
- After that, you can open another terminal (or type in 'quit' in your mysql shell) and then run '`node index.js`'.
- there will be several options displayed in your terminal in a list. These options are as follows:
    - view departments/roles/employees: all of these options simply allow you to view the tables they reference.
    - add a department/role/employee: these options allow you to add a new item to the referenced tables.
    - update an employee: this option allows you to edit a pre-existing entry on the employees table.
    - quit: exits the application.


### Link to Video Walkthrough
[Click me!](https://drive.google.com/file/d/1eSKESE6QWoycWijIvyXa87fgqk2y0nxd/view?usp=sharing)