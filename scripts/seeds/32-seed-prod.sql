USE clockingo_prod;

INSERT INTO clockingo_prod.Roles
(Id, Name)
VALUES(1, 'Admin');
INSERT INTO clockingo_prod.Roles
(Id, Name)
VALUES(2, 'Worker');

INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(1, 'Inicio', 'Home', NULL, 1, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(2, 'Usuarios', 'Users', NULL, 1, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(3, 'Buscar existentes', 'Find existing', 2, 2, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(4, 'Crear nuevo', 'Create new', 2, 2, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(5, 'Actualizar existente', 'Update existing', 2, 2, 3, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(6, 'Eliminar existente', 'Delete existing', 2, 2, 4, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(7, 'Ubicaciones', 'Locations', NULL, 1, 3, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(8, 'Buscar existentes', 'Find existing', 7, 2, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(9, 'Crear nueva', 'Create new', 7, 2, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(10, 'Actualizar existente', 'Update existing', 7, 2, 3, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(11, 'Eliminar existente', 'Delete existing', 7, 2, 4, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(12, 'Entradas', 'Entries', NULL, 1, 4, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(13, 'Agregar nueva', 'Add new', 12, 2, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(14, 'Buscar existentes', 'Find existing', 12, 2, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(15, 'Salidas', 'Exits', NULL, 1, 5, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(16, 'Agregar nueva', 'Add new', 15, 2, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(17, 'Buscar existentes', 'Find existing', 15, 2, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(18, 'Configuración', 'Settings', NULL, 1, 6, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(19, 'Roles', 'Role', 18, 2, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(20, 'Agregar nuevo', 'Add new', 19, 3, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(21, 'Gestionar permisos', 'Manage permissions', 19, 3, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(22, 'TOTP', 'TOTP', 18, 2, 2, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(23, 'Registrar TOTP', 'Register TOTP', 22, 3, 1, 0);
INSERT INTO clockingo_prod.Menus
(Id, NameEs, NameEn, ParentId, Level, DisplayOrder, IsDeleted)
VALUES(24, 'Administrar TOTPs', 'Manage TOTPs', 22, 3, 2, 0);

INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 1);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 2);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 3);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 4);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 5);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 6);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 7);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 8);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 9);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 10);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 11);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 12);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 13);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 14);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 15);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 16);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 17);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 18);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 19);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 20);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 21);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 22);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 23);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(1, 24);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 12);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 13);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 14);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 15);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 16);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 17);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 18);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 22);
INSERT INTO clockingo_prod.MenuRoles
(RoleId, MenuId)
VALUES(2, 23);

INSERT INTO clockingo_prod.Users
(Id, Name, Phone, Username, AuthToken, RoleId, IsDeleted, TotpSecret, TwoFactorEnabled)
VALUES(1, 'Administrator', '000-0000', 'administrator', 'auth123adminprod', 1, 0, 'JBSWY3DPEHPK3PXP', 1);


INSERT INTO clockingo_prod.Locations
(Id, Code, Address, City, CreatedBy, IsCompanyOffice, IsDeleted)
VALUES(1, 'NGQ1MzQxNzQ0OTQ0NDU3OTRkNzk0MjRlNTk1NzZjNzU0OTQ2NGUzMDQ5NDMzMDY3NTUzMzQyNzk2MTU3MzU2ZTVhNmQ2YzZjNjI0NzUyN2E=', '123 Main St', 'Springfield', 1, 1, 0);