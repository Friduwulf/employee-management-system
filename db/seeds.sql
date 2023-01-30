INSERT INTO department (name)
VALUES  ("Taproom"),
        ("Brewery"),
        ("Sales"),
        ("Marketing"),
        ("Quality Control"),
        ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES  ("Server", 28600, 001),
        ("Packager", 28600, 002),
        ("Cellerman", 31200, 002),
        ("Brewer", 37440, 002),
        ("Sales Rep", 41600, 003),
        ("Social Media", 37440, 004),
        ("In-person Marketing", 37440, 004),
        ("Lab Technician", 45760, 005),
        ("Accountant", 45760, 006),
        ("Bar Manager", 45760, 001),
        ("Head Brewwer", 50000, 002),
        ("Sales Lead", 50000, 003),
        ("Marketing Manager", 50000, 004),
        ("Quality Control Coordinator", 55000, 005),
        ("Chief Finance Officer", 60000, 006);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Devin", "Kearney", 014, NULL),
        ("Eliah", "Hunter", 008, 001),
        ("Ryan", "Mchlaughlan", 011, NULL),
        ("Bennet", "Clungsten", 004, 003),
        ("Gregg", "Macafee", 010, NULL),
        ("Nick", "Marantz", 001, 005),
        ("Trevor", "Plug", 012, NULL),
        ("Jennie", "Hunter", 013, NULL),
        ("Dawn", "Dixon", 015, NULL),
        ("Mike", "Casey", 005, 007),
        ("Barb", "Free", 009, 009),
        ("Ashley", "Walsh", 006, 008),
        ("Ali", "Losenn", 007, 008),
        ("Seb", "Kennet", 003, 003),
        ("Jamie", "Akens", 002, 003);