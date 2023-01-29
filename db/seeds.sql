INSERT INTO department (id, name)
VALUES  (001, "Taproom"),
        (002, "Brewery"),
        (003, "Sales"),
        (004, "Marketing"),
        (005, "Quality Control"),
        (006, "Accounting");

INSERT INTO role (id, title, salary, department_id)
VALUES  (001, "Server", 28600, 001),
        (002, "Packager", 28600, 002),
        (003, "Cellerman", 31200, 002),
        (004, "Brewer", 37440, 002),
        (005, "Sales Rep", 41600, 003),
        (006, "Social Media", 37440, 004),
        (007, "In-person Marketing", 37440, 004),
        (008, "Lab Technician", 45760, 005),
        (009, "Accountant", 45760, 006),
        (010, "Bar Manager", 45760, 001),
        (011, "Head Brewwer", 50000, 002),
        (012, "Sales Lead", 50000, 003),
        (013, "Marketing Manager", 50000, 004),
        (014, "Quality Control Coordinator", 55000, 005),
        (015, "Chief Finance Officer", 60000, 006);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (001, "Devin", "Kearney", 014, NULL),
        (002, "Eliah", "Hunter", 008, 001),
        (003, "Ryan", "Mchlaughlan", 011, NULL),
        (004, "Bennet", "Clungsten", 004, 003),
        (005, "Gregg", "Macafee", 010, NULL),
        (006, "Nick", "Marantz", 001, 005),
        (007, "Trevor", "Plug", 012, NULL),
        (008, "Jennie", "Hunter", 013, NULL),
        (009, "Dawn", "Dixon", 015, NULL),
        (010, "Mike", "Casey", 005, 007),
        (011, "Barb", "Free", 009, 009),
        (012, "Ashley", "Walsh", 006, 008),
        (013, "Ali", "Losenn", 007, 008),
        (014, "Seb", "Kennet", 003, 003),
        (015, "Jamie", "Akens", 002, 003);