const inquirer = require('inquirer');
const table = require('console.table');
const mysql = require('mysql2');

var newEmp = {
    first_name: null,
    last_name: null,
    role_id: null,
    manager_id: null
};

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employees_db',
    password: 'root'
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected to server successfully!");
    runAPP();
});

function runAPP() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "start",
                message: "Welcome to the employee tracker! What would you like to do?",
                choices: [
                    "View Departments", 
                    "View Roles", 
                    "View Employees",
                    "View Employees By Manager",
                    "View Employees By Department",
                    "View Department Utilized Budget",
                    "Add New Department", 
                    "Add New Role", 
                    "Add New Employee", 
                    "Change An Employee's Role",
                    "Change An Employee's Manager",
                    "Leave Application"]
            }
        ]).then (function(result) {
            switch(result.start) {
                case "View Departments": viewDepartments();
                    break;
                case "View Roles": viewRoles();
                    break;
                case "View Employees": viewEmployees();
                    break;
                case "View Employees By Manager": viewEmployeesByManager();
                    break;
                case "View Employees By Department": viewEmployeesByDepartment();
                    break;    
                case "View Department Utilized Budget": viewDepartmentBudget();
                    break;            
                case "Add New Department": newDepartment();
                    break;
                case "Add New Role": newRole();
                    break;
                case "Add New Employee": newEmployee();
                    break;
                case "Change An Employee's Role": updateEmployeeRole();
                    break;
                case "Change An Employee's Manager": updateEmployeeManager();
                    break;
                case "Leave Application": 
                    console.log("--------------------------------------------------------");
                    console.log("                      Goodbye!");
                    console.log("--------------------------------------------------------");
                    break;
                default: console.log("Selection is a Dead End");
            }
        });
}

viewEmployees = () => {
    connection.query("SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, role.salary AS Salary, department.name AS Department, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    (err, results) => {
        if(err) throw err;
        console.log("----------------Here are all of your employees!----------------", '\n');
        console.table(results);
        runAPP();
    });
}

viewRoles = () => {
    connection.query("SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id",
    (err, results) => {
        if(err) throw err;
        console.log("----------------Here are all of your roles!----------------", '\n');
        console.table(results);
        runAPP();
    });
}

viewDepartments = () => {
    connection.query("SELECT department.id AS ID, department.name AS Name FROM department",
    (err, results) => {
        if(err) throw err;
        console.log("----------------Here are all of your departments!----------------", '\n');
        console.table(results);
        runAPP();
    });
}

viewEmployeesByManager = () => {
    connection.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "manager",
                type: "rawlist",
                choices: () => {
                    var managerArr = [];
                    for (i=0; i< results.length; i++) {
                        managerArr.push(results[i].first_name + ' ' + results[i].last_name)
                    }
                    managerArr.push('Managers');
                    return managerArr;
                },
                message: "Which manager's team would you like to view?"
            }
        ]).then((answer) => {
            const manager = answer.manager.split(" ");
            connection.query(`Select * FROM employee WHERE first_name = '${manager[0]}' AND last_name = '${manager[1]}'`, (err, results) => {
                if(err) throw err;
                connection.query(`SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE employee.manager_id = '${results[0].id}'`, (err, results) => {
                    if(err) throw err;
                    console.log(`----------Here are the employees working for ${answer.manager}----------`, '\n');
                    console.table(results);
                    runAPP();
                })
            })
        });
    });
}

viewEmployeesByDepartment = () => {
    connection.query("SELECT * FROM department", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "department",
                type: "rawlist",
                choices: () => {
                    var depArr = [];
                    for (i=0; i< results.length; i++) {
                        depArr.push(results[i].name)
                    }
                    return depArr;
                },
                message: "Which department would you like to view?"
            }
        ]).then((answer) => {
            connection.query(`SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}'`, (err, results) => {
                if(err) throw err;
                console.log(`---------Here are the employees working in the ${answer.department}---------`, '\n');
                console.table(results);
                runAPP();
            })
        });
    });
}

viewDepartmentBudget = () => {
    connection.query("SELECT * FROM department", (err, results) => {
        inquirer
        .prompt([
            {
                name: "department",
                type: "rawlist",
                choices: () => {
                    const depArr = [];
                    for (i=0; i< results.length; i++) {
                        depArr.push(results[i].name);
                    }
                    return depArr;
                },
                message: "Which which department would you like to see the budget of?"
            }
        ]).then((answer) => {
            connection.query(`SELECT * FROM department WHERE department.name = '${answer.department}'`, (err, results) => {
                if(err) throw err;
                connection.query(`SELECT SUM(salary) AS Salaries FROM role WHERE department_id = '${results[0].id}'`, (err, results) => {
                    if(err) throw err;
                    console.log(`The total budget utilized by the ${answer.department} is:`, '\n');
                    console.table(results);
                    runAPP();
                });
            });
        });
    });
}

newDepartment = () => {
    inquirer
    .prompt([
        {
            name: "department",
            type: "input",
            message: "What is the name of the new department?"
        }
    ]).then((answer) => {
        connection.query(
            "INSERT INTO department VALUES (DEFAULT, ?)",
            [answer.department],
            (err) => {
                if(err) throw err;
                console.log("-------------------------------------");
                console.log(answer.department + " added to departments list!");
                console.log("-------------------------------------");
                runAPP();
            }
        )
    });
}

newRole = () => {
    connection.query("SELECT * FROM department", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "What is the name of the new role?"
            },
            {
                name: "salary",
                type: "number",
                message: "What is the salary of the new role?",
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "departmentName",
                type: "rawlist",
                choices: () => {
                    var depArr = [];
                    for (i=0; i< results.length; i++) {
                        depArr.push(results[i].name)
                    }
                    return depArr;
                },
                message: "What department does the role belong to?"
            }
        ]).then((answer) => {
            connection.query(`SELECT id FROM department WHERE name = '${answer.departmentName}'`, (err, results) => {
                if(err) throw err;
                console.log(results[0].id);
            connection.query("INSERT INTO role SET ?",
                    {
                        title: answer.role,
                        salary: answer.salary,
                        department_id: results[0].id
                    },
                    (err) => {
                        if(err) throw err;
                        console.log("-------------------------------------");
                        console.log(answer.role + " added to roles list!");
                        console.log("-------------------------------------");
                        runAPP();
                    }
                )
            });
        });
    })
}

newEmployee = () => {

    connection.query("SELECT * FROM role", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name of the new employee?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name of the new employee?",
            },
            {
                name: "roleName",
                type: "rawlist",
                choices: () => {
                    var roleArr = [];
                    for (i=0; i< results.length; i++) {
                        roleArr.push(results[i].title)
                    }
                    return roleArr;
                },
                message: "What role is the new employee taking on?"
            }
        ]).then((answer) => {
            connection.query(`SELECT id FROM role WHERE title = '${answer.roleName}'`, (err, results) => {
                if(err) throw err;
                newEmp.first_name = answer.firstName;
                newEmp.last_name = answer.lastName;
                newEmp.role_id = results[0].id;
                managerQuestion();
            });
        });
    })
}

managerQuestion = () => {
    connection.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "managerName",
                type: "rawlist",
                choices: () => {
                    var managerArr = [];
                    for (i=0; i< results.length; i++) {
                        managerArr.push(results[i].first_name + ' ' + results[i].last_name)
                    }
                    managerArr.push('None');
                    return managerArr;
                },
                message: "What is the name of the manager of this new employee?"
            }
        ]).then((answer) => {
            const managerSplit = answer.managerName.split(" ");
            connection.query(`SELECT * FROM employee WHERE first_name = '${managerSplit[0]}' AND last_name = '${managerSplit[1]}'`, (err, results) => {
                if(err) throw err;
                if(answer.managerName !== 'None') {   
                    newEmp.manager_id = results[0].id;
                }
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: newEmp.first_name,
                last_name: newEmp.last_name,
                role_id: newEmp.role_id,
                manager_id: newEmp.manager_id
            },
            (err) => {
                if(err) throw err;
                console.log("-------------------------------------");
                console.log(`${newEmp.first_name} ${newEmp.last_name} added to roles list!`);
                console.log("-------------------------------------");
                runAPP();
            }
            )
            });
        });
    });
}

updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                choices: () => {
                    var empArr = [];
                    for (i=0; i< results.length; i++) {
                        empArr.push(results[i].first_name + ' ' + results[i].last_name)
                    }
                    return empArr;
                },
                message: "What is the name of the employee you would like to update?"
            }
        ]).then((answer) => {
            const nameSplit = answer.employee.split(" ");
            newEmp.first_name = nameSplit[0];
            newEmp.last_name = nameSplit[1];
            connection.query("SELECT * FROM role", (err, results) => {
                if(err) throw err;
                inquirer
                .prompt([
                    {
                        name: "roleName",
                        type: "rawlist",
                        choices: () => {
                            var roleArr = [];
                            for (i=0; i< results.length; i++) {
                                roleArr.push(results[i].title)
                            }
                            return roleArr;
                        },
                        message: "What new role is the employee taking on?"
                    }
                ]).then((answer) => {
                    connection.query(`SELECT id FROM role WHERE title = '${answer.roleName}'`, (err, results) => {
                        if(err) throw err;
                        newEmp.role_id = results[0].id;
                        connection.query(`UPDATE employee SET role_id = '${newEmp.role_id}' WHERE first_name = '${newEmp.first_name}' AND last_name = '${newEmp.last_name}'`,
                            (err) => {
                                if(err) throw err;
                                console.log("-------------------------------------");
                                console.log(`${newEmp.first_name} ${newEmp.last_name} has an updated role!`);
                                console.log("-------------------------------------");
                                runAPP();
                            }
                        )
                    })
                });
            });
        });
    });
}

updateEmployeeManager = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                choices: () => {
                    var empArr = [];
                    for (i=0; i< results.length; i++) {
                        empArr.push(results[i].first_name + ' ' + results[i].last_name)
                    }
                    return empArr;
                },
                message: "What is the name of the employee you would like to update?"
            },
            {
                name: "managerName",
                type: "rawlist",
                choices: () => {
                    var managerArr = [];
                    for (i=0; i< results.length; i++) {
                        managerArr.push(results[i].first_name + ' ' + results[i].last_name)
                    }
                    return managerArr;
                },
                message: "Who is the new manager of this employee?"
            }
        ]).then((answer) => {
            const nameSplit = answer.employee.split(" ");
            const managerSplit = answer.managerName.split(" ");
            newEmp.first_name = nameSplit[0];
            newEmp.last_name = nameSplit[1];
            connection.query(`SELECT * FROM employee WHERE first_name = '${managerSplit[0]}' AND last_name = '${managerSplit[1]}'`, (err, results) => {
                if(err) throw err;
                const managerID = results[0].id;
                connection.query(`UPDATE employee SET manager_id = '${managerID}' WHERE first_name = '${newEmp.first_name}' AND last_name = '${newEmp.last_name}'`,
                        (err) => {
                            if(err) throw err;
                            console.log("-------------------------------------");
                            console.log(`${newEmp.first_name} ${newEmp.last_name} has an updated manager!`);
                            console.log("-------------------------------------");
                            runAPP();
                    }
                )
            })
        })
    })
}