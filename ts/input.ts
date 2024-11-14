import inquirer from 'inquirer'
import { pool, connectToDb } from './connection.js';
import { QueryResult } from 'pg';

await connectToDb()


const depts = []
const roles = []
const employees = []
function loadDepts() {

    //GET department names from query result
    //PUSH department names into depts array
    //RETURN depts array
    pool.query('SELECT name FROM department', (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < result.rows.length; i++) {
                depts.push(result.rows[i].name)
            }
            //Push results to depts array
        }
        // console.log(`List of department names: ${depts}`) // Test log
    });

}
function loadRoles() {

    //GET department names from query result
    //PUSH department names into depts array
    //RETURN depts array
    pool.query('SELECT title, id FROM role', (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('Um? ', result.rows);
            for (let i = 0; i < result.rows.length; i++) {
                let newRole = {
                    name: result.rows[i].title,
                    value: result.rows[i].id
                };
                roles.push(newRole);
            }
            //Push results to roles array
        }
        // console.log(`List of roles: ${roles}`) // Test log
    });

}

function loadEmps() {

    //GET employee names from query result
    //PUSH employee names into depts array
    //RETURN employees array
    pool.query('SELECT first_name, last_name FROM employee', (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('Um? ', result.rows);
            for (let i = 0; i < result.rows.length; i++) {
                let newEmp = result.rows[i].first_name
                employees.push(newEmp);
            }
            //Push results to roles array
            // console.log(`List of employee names: ${employees}`) // Test log
        }
    });

}
loadDepts();
loadRoles();
loadEmps()
//When starting application, use inquirer to ask user what they want to do.
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

function choosePrompts() {
    inquirer
        .prompt({
            type: "list",
            message: "Welcome to the employee tracker! What would you like to do?",
            choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee", "Update employee role"],
            name: "actions"
        })
        .then((answers: { actions: string }) => {

            if (answers.actions === "View departments") {
                //WHEN I choose to view all departments
                // THEN I am presented with a formatted table showing department names and department ids
                pool.query('SELECT * FROM department ORDER BY id ASC', (err: Error, result: QueryResult) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result.rows)
                    }
                });
            } else if (answers.actions === "View roles") {
                //WHEN I choose to view all roles
                //THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
                pool.query('SELECT * FROM role ORDER BY id ASC', (err: Error, result: QueryResult) => {
                    if (err) {
                        console.log(err);
                    } else if (result) {
                        console.log(result.rows);
                    }
                });
            } else if (answers.actions === "View employees") {
                //WHEN I choose to view all employees
                //THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
                pool.query('SELECT * FROM employee ORDER BY id ASC', (err: Error, result: QueryResult) => {
                    if (err) {
                        console.log(err);
                    } else if (result) {
                        console.log(result.rows);
                    }
                });
            } else if (answers.actions === "Add department") {
                // WHEN I choose to add a department
                // THEN I am prompted to enter the name of the department and that department is added to the database
                inquirer
                    .prompt({
                        type: "input",
                        message: "What is the new department called?",
                        name: "deptinput"
                    }
                    ).then((deptans: { deptinput: string; deptid: number; }) => {
                        pool.query('INSERT INTO department(name) VALUES($1) RETURNING *', [deptans.deptinput], (err: Error) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`${deptans.deptinput} added to department table!`);
                                depts.push(deptans.deptinput)
                            }
                        });
                    })

            } else if (answers.actions === "Add role") {
                //WHEN I choose to add a role
                //THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
                inquirer
                    .prompt([{
                        type: "input",
                        message: "What is the new role called?",
                        name: "rolename",
                    },
                    {
                        type: "number",
                        message: "What is the salary for this role?",
                        name: "rolesalary"
                    },
                    {
                        type: "list",
                        message: "Which department needs this role?",
                        choices: depts,
                        name: "roledept"

                    }])
                    .then((roleans: { rolename: string; rolesalary: number; roledept: string }) => {

                        function deptToID() {

                            // Code assisted by Xpert learning assistant
                            return new Promise((resolve, reject) => {
                                pool.query('SELECT id FROM department WHERE name = $1', [roleans.roledept], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    } else {
                                        const deptID = result.rows.length > 0 ? result.rows[0].id : null;
                                        resolve(deptID);
                                    }
                                });
                            });
                        }
                        // function deptToID() {
                        //     pool.query('SELECT id FROM department WHERE name = $1', [roleans.roledept],(err: Error, result: QueryResult) => {
                        //         if (err) {
                        //             console.log(err);
                        //         } else {
                        //             const deptID = result.rows.indexOf(roleans.roledept) + 1
                        //             return deptID;
                        //         };
                        //         // console.log(`List of department names: ${depts}`) // Test log
                        //     });
                        // };
                        deptToID()
                            .then(deptID => {
                                // console.log("HEY WHAT", deptID);
                                pool.query('INSERT INTO role (title, salary, department) VALUES($1, $2, $3) RETURNING *', [roleans.rolename, roleans.rolesalary, deptID], (err: Error) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(`${roleans.rolename} role added to role table!`);
                                        roles.push(roleans.rolename);
                                    }
                                });
                            })

                    })
            } else if (answers.actions === "Add employee") {
                // WHEN I choose to add an employee
                // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
                inquirer
                    .prompt([{
                        type: "input",
                        message: "What is the employee's first name?",
                        name: "empFirstName"
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name?",
                        name: "empLastName"
                    },
                    {
                        type: "list",
                        message: "What role does the employee fulfill?",
                        choices: roles,
                        name: "empRole"
                    },
                    {
                        type: "number",
                        message: "What is their manager's id?",
                        name: "empMgr"
                    }
                    ])
                    .then(empAns => {
                        // console.log('Ayy!', empAns);
                        // function roleToID() {

                        //     // Code assisted by Xpert learning assistant
                        //     return new Promise((resolve, reject) => {
                        //         pool.query('SELECT id FROM department WHERE name = $1', [empAns.empRole], (err, result) => {
                        //             if (err) {
                        //                 console.log(err);
                        //                 reject(err);
                        //             } else {
                        //                 const roleID = result.rows.length > 0 ? result.rows[0].id : null;
                        //                 resolve(roleID);
                        //             }
                        //         });
                        //     });
                        // }
                        // roleToID()
                        //     .then(roleID => {
                        pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)', [empAns.empFirstName, empAns.empLastName, empAns.empRole, empAns.empMgr], (err: Error) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`${empAns.empFirstName} ${empAns.empLastName} added to employee table!`);
                                let newEmp = empAns.empFirstName + " " + empAns.empLastName
                                employees.push(newEmp)
                            }
                        });
                        //         })
                    })
            } else if (answers.actions === "Update employee role") {
                //WHEN I choose to update an employee role
                //THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
                inquirer
                    .prompt([{
                        type: "list",
                        choices: employees,
                        message: "Which employee's role would you like to update?",
                        name: "updEmp"
                    },
                    {
                        type: "list",
                        choices: roles,
                        message: "Which new role do you want them to have?",
                        name: "updRole"
                    }
                    ])
                    .then(update => {
                        //SQL UPDATE SYNTAX
                        // UPDATE table_name
                        // SET column1 = value1, column2 = value2, ...
                        // WHERE condition;


                        // // Code assisted by Xpert learning assistant ///////////////////////////////////////////////
                        // const roleId = roles.find(role => (role.title === updRole)).id; // Get the new role's ID
                        // ////////////////////////////////////////////////////////////////////////////////////////////
                        pool.query('UPDATE employee SET role_id = $1 WHERE first_name = $2', [update.updRole, update.updEmp], (err: Error) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`${update.updEmp}'s role has been updated!`);
                            }
                        });
                    })
            }
        })
        // Code to try making application more convenient (as of now, you have to reload the file in order to do several actions)
        // .then(() => {
        //     inquirer
        //         .prompt({
        //             type: "confirm",
        //             name: "tf",
        //             message: "Would you like to do something else?"
        //         })
        //         .then((answer) => {
        //             if (answer.tf === true) {
        //                 choosePrompts()
        //             } else {
        //                 return
        //             }
        //         })

        // })
}


choosePrompts()

