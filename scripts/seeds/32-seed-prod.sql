USE clockingo_prod;

INSERT INTO clockingo_prod.Roles
(Id, Name)
VALUES(1, 'Admin');
INSERT INTO clockingo_prod.Roles
(Id, Name)
VALUES(2, 'Worker');

INSERT INTO clockingo_prod.Users
(Id, Name, Phone, Username, AuthToken, RoleId, IsDeleted)
VALUES(1, 'Administrator', '000-0000', 'administrator', 'auth123adminprod', 1, 0);

INSERT INTO clockingo_prod.Locations
(Id, Code, Address, City, CreatedBy, IsCompanyOffice, IsDeleted)
VALUES(1, 'NGQ1MzQxNzQ0OTQ0NDU3OTRkNzk0MjRlNTk1NzZjNzU0OTQ2NGUzMDQ5NDMzMDY3NTUzMzQyNzk2MTU3MzU2ZTVhNmQ2YzZjNjI0NzUyN2E=', '123 Main St', 'Springfield', 1, 1, 0);