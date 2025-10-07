import knex from '../../src/shared/infrastructure/db/knex';

const TABLES = ['Exits', 'Entries', 'Locations', 'Users', 'Roles'];

const rolesSeed = [
    { Id: 1, Name: 'Admin' },
    { Id: 2, Name: 'Worker' }
];

const usersSeed = [
    { Id: 1, Name: 'Douglas Cortes', Phone: '555-3003', Username: 'dcortes', AuthToken: 'auth123admin', RoleId: 1, IsDeleted: 0 },
    { Id: 2, Name: 'Bob Johnson', Phone: '555-1002', Username: 'bjohnson', AuthToken: 'auth456admin', RoleId: 1, IsDeleted: 0 },
    { Id: 3, Name: 'Carol White', Phone: '555-1003', Username: 'cwhite', AuthToken: 'auth789admin', RoleId: 1, IsDeleted: 0 },
    { Id: 4, Name: 'David Brown', Phone: '555-2001', Username: 'dbrown', AuthToken: 'auth101worker', RoleId: 2, IsDeleted: 0 },
    { Id: 5, Name: 'Eve Davis', Phone: '555-2002', Username: 'edavis', AuthToken: 'auth102worker', RoleId: 2, IsDeleted: 0 },
    { Id: 6, Name: 'Frank Green', Phone: '555-2003', Username: 'fgreen', AuthToken: 'auth103worker', RoleId: 2, IsDeleted: 0 },
    { Id: 7, Name: 'Grace Hall', Phone: '555-2004', Username: 'ghall', AuthToken: 'auth104worker', RoleId: 2, IsDeleted: 0 },
    { Id: 8, Name: 'Henry King', Phone: '555-2008', Username: 'hking', AuthToken: 'auth105worker', RoleId: 2, IsDeleted: 0 },
    { Id: 9, Name: 'Ivy Lee', Phone: '555-2006', Username: 'ilee', AuthToken: 'auth106worker', RoleId: 2, IsDeleted: 0 },
    { Id: 10, Name: 'Jack Miller', Phone: '555-2007', Username: 'jmiller', AuthToken: 'auth107worker', RoleId: 2, IsDeleted: 0 },
    { Id: 11, Name: 'Raul Rodriguez', Phone: '555-1001', Username: 'rrodriguez', AuthToken: 'auth108worker', RoleId: 2, IsDeleted: 0 },
    { Id: 12, Name: 'Charles Xavier ', Phone: '555-2008', Username: 'cxavier', AuthToken: 'auth123worker', RoleId: 2, IsDeleted: 0 },
    { Id: 13, Name: 'Jean Gray', Phone: '555-2009', Username: 'jgray', AuthToken: 'auth109admin', RoleId: 1, IsDeleted: 0 },
    { Id: 14, Name: 'Rufus Radner', Phone: '555-3001', Username: 'rrad', AuthToken: 'auth123worker', RoleId: 2, IsDeleted: 0 },
    { Id: 15, Name: 'Rafael Hernandez', Phone: '555-3002', Username: 'rhernandez', AuthToken: 'auth123worker', RoleId: 2, IsDeleted: 0 }
];

const locationsSeed = [
    { Id: 1, Code: 'NGQ1MzQxNzQ0OTQ0NDU3OTRkNzk0MjRlNTk1NzZjNzU0OTQ2NGUzMDQ5NDMzMDY3NTUzMzQyNzk2MTU3MzU2ZTVhNmQ2YzZjNjI0NzUyN2E=', Address: '123 Main St', City: 'Springfield', CreatedBy: 1, IsCompanyOffice: 1, IsDeleted: 0 },
    { Id: 2, Code: 'NGQ2OTQxNzQ0OTQ0NTEzMTRlNjk0MjU4NTk1ODRhNmM2MTQ3MzkzMTYzMzI1NTY3NTE1ODVhNmM0OTQzMzA2NzU0NTc1NjMwNjM2ZDM5Nzc2MjMyNzg3MDYzNzczZDNk', Address: '456 Warehouse Ave', City: 'Metropolis', CreatedBy: 2, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 3, Code: 'NGQ3OTQxNzQ0OTQ0NjMzNDRmNTM0MjQzNjM2ZDQ2NzU1OTMyNjc2NzU1NmQ1MTY3NGM1MzQyNDg2MjMzNTI2ZjU5NTczMDNk', Address: '789 Branch Rd', City: 'Gotham', CreatedBy: 3, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 4, Code: 'NGU0MzQxNzQ0OTQ0NDU3NzRkNTM0MjUwNWE2ZDVhNzA1OTMyNTU2NzU1NDc0Njc5NjE3OTQxNzQ0OTQ2NGUzMDU5NTg0OTY3NTEzMjZjMzA2NTUxM2QzZA==', Address: '101 Office Park', City: 'Star City', CreatedBy: 4, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 5, Code: 'NGU1MzQxNzQ0OTQ0NDk3NzRkNjk0MjUzNWE1ODRlNmM1OTU4NGE2YTYxNDM0MjQzNjI0ODVhNmI0OTQzMzA2NzUxMzI1Njc1NjQ0ODRhNjg2MjQzNDI0NDYxNTg1MjM1', Address: '202 Research Blvd', City: 'Central City', CreatedBy: 5, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 6, Code: 'NGU2OTQxNzQ0OTQ0NGQ3NzRkNzk0MjUzNWE1ODUyNjg2MTU3Nzc2NzU1NDc3ODY4NjU2ZDQ1Njc0YzUzNDI0NDYyMzI0NjdhNjQ0MzQyNDQ2MTU4NTIzNQ==', Address: '303 Retail Plaza', City: 'Coast City', CreatedBy: 6, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 7, Code: 'NGU3OTQxNzQ0OTQ0NTE3NzRlNDM0MjRhNjI2ZDUyMzE2MzMzNTI3OTYxNTc0NjczNDk0NjY0Njg2NTUzNDE3NDQ5NDUzOTY4NjEzMjY4Njg2NDZkNTY3NQ==', Address: '404 Industrial Way', City: 'Oakhaven', CreatedBy: 7, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 8, Code: 'NGY0MzQxNzQ0OTQ0NTU3NzRlNTM0MjQ1NjE1ODRlMzA2MzZkNmM2OTY0NTg1MjQzNjIzMjM0Njc1MTMyNmM3OTQ5NDMzMDY3NTU2ZDZjMzI1YTU4NGE2YjU5NTc3ODZj', Address: '505 Distribution Cir', City: 'Riverdale', CreatedBy: 8, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 9, Code: 'NGY1MzQxNzQ0OTQ0NTk3NzRlNjk0MjRhNjI2ZDM1NzY2NDZkNDYzMDYxNTczOTc1NDk0NTUyNzk0OTQzMzA2NzUzNmU1Njc0NjM0MzQyNDQ2MTU4NTIzNQ==', Address: '606 Innovation Dr', City: 'Jump City', CreatedBy: 9, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 10, Code: 'NGQ1NDQxNjc0YzUzNDEzMzRkNDQ2MzY3NTI2ZDQ2NmE2NDQ3Mzk3OTY1NTM0MjUzNWE0MzQxNzQ0OTQ1NGE3MzY0NTc1MjZmNTk1ODVhNmM2MjY3M2QzZA==', Address: '707 Factory Rd', City: 'Bludhaven', CreatedBy: 10, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 11, Code: 'NGQ1NDQ1Njc0YzUzNDEzNDRkNDQ2NzY3NTI0NzU2MzI1YTU3Nzg3NjYzNDczMTUzMjNmMTA0OTU4NTgzYzM1MjczNjMyNmMzMDVhNTM0MTc0NDk0NTMxNzA1YTQ4NjQ2ODY1NTM0MjQ0NjE1ODUyMzU=', Address: '808 Development Site', City: 'Midway City', CreatedBy: 1, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 12, Code: 'NGQ1NDQ5Njc0YzUzNDEzNTRkNDQ2YjY3NTY0NzU2Nzk2MjU3NmM3NTU5NTc3NzY3NTUzMzUxNjc0YzUzNDI1NDYyNTc0NjczNjI0ODVhNzA2MjQ3Nzg2Yw==', Address: '909 Terminal St', City: 'Smallville', CreatedBy: 2, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 13, Code: 'NGQ1NDRkNjc0YzUzNDE3ODRkNTQ0MTY3NTYzMjQ2MzA1YTU4NGE2ZDYzNmQzOTU0Njc1Njc0YzUzNDI0OTU5NTg0Mjc3NjU1MzQyNDk1OTU4NGE2OTYyMzM0OTNk', Address: '110 Waterfront Ave', City: 'Happy Harbor', CreatedBy: 3, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 14, Code: 'NGQ1NDUxNjc0YzUzNDE3OTRkNTQ0OTY3NTUzMjU2Nzk2NDZkNTY3OTQ5NDU1NDczNDY3NGM1MzQyNGM1YTU4NmM3YTY0NDczOTc1NWE1NTRlNzA2NDQ4NmIzZA==', Address: '212 Server Farm Ln', City: 'Keystone City', CreatedBy: 4, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 15, Code: 'NGQ1NDU1Njc0YzUzNDE3YTRkNTQ0ZDY3NTU2ZDQ2NzQ2MzQ3NDY3OTY0NDM0MjU0NjQ0MzQxNzQ0OTQ1NjgzMTU5Njk0MjQ0NjE1ODUyMzU=', Address: '313 Rampart St', City: 'Hub City', CreatedBy: 5, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 16, Code: 'NGQ1NDU5Njc0YzUzNDEzMDRkNTQ1MTY3NTUzMjRlNmY2MjMyMzk3MzYxNDczOTMxNjMzMjU1Njc1NTZkNTE2NzRjNTM0MjRhNjQ2ZTZiNjc1NjQ3MzkzMzYyNjczZDNk', Address: '414 Schoolhouse Rd', City: 'Ivy Town', CreatedBy: 6, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 17, Code: 'NGQ1NDYzNjc0YzUzNDEzMTRkNTQ1NTY3NTU0ODRhNzY2MTZkNTY2YTY0NDM0MjQ0NjQ0MzQxNzQ0OTQ1NWE2ODY0MzI0ZTZjNjQ0MzQyNDQ2MTU4NTIzNQ==', Address: '515 Project Ct', City: 'Fawcett City', CreatedBy: 7, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 18, Code: 'NGQ1NDY3Njc0YzUzNDEzMjRkNTQ1OTY3NTIzMjQ2MzA1YTU4NjQ2ODY1NTM0MjQzNjI0ODVhNmI0OTQzMzA2NzUyMzI1Njc0NjMzMzUyNzY2MjZkNTU2NzUxMzI2YzMwNjU1MTNkM2Q=', Address: '616 Gateway Blvd', City: 'Gemstone City', CreatedBy: 8, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 19, Code: 'NGQ1NDZiNjc0YzUzNDEzMzRkNTQ2MzY3NTEzMjU2NzU2NDQ4NGE2ODYyNDM0MjQ5NjQ1NzQ5Njc0YzUzNDI0ZjU5NTg1MjcwNjIzMjM1Njg2MjQzNDI0NDYxNTg1MjM1', Address: '717 Central Hub', City: 'National City', CreatedBy: 9, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 20, Code: 'NGQ2YTQxNjc0YzUzNDEzNDRkNTQ2NzY3NTQzMzU2MzA1YTU4NDk2NzU1NDc1Njc5NjE1NzMxNmM2NDQ3NTY3OTQ5NDMzMDY3NTU0NzQ2Nzk1OTU3NTI3MDYzMzI1NTY3NTM1ODRlNzM1OTU3MzU2Yg==', Address: '818 Outer Perimeter', City: 'Paradise Island', CreatedBy: 10, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 21, Code: 'TUNBdElERXlNeUJOWVdsdUlGTjBJQzBnVTNCeWFXNW5abWxsYkdSeg==', Address: '123 Main St', City: 'Springfields', CreatedBy: 1, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 22, Code: 'TVRJeklFMWhhVzRnVTNRZ0xTQlRjSEpwYm1kbWFXVnNaSE09', Address: '123 Main St', City: 'Springfields', CreatedBy: 1, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 23, Code: 'NGQ1NDQ5N2E0OTQ1MzE2ODYxNTczNDY3NTUzMzUxNjc0YzUzNDI1NDYzNDg0YTcwNjI2ZDY0NmQ2MTU3NTY3MzVhNDg0ZDNk', Address: '123 Main St', City: 'Springfields', CreatedBy: 1, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 24, Code: 'NGQ2YTU1MzM0OTQ1NTY3YTY0NDc1Njc5NDk0NTQ2MzI1YTUzNDE3NDQ5NDY2NDY4NjEzMjQ2NzU1YTQ3NDUzZA==', Address: '257 Ester Ave', City: 'Wakanda', CreatedBy: 1, IsCompanyOffice: 0, IsDeleted: 0 }
];

const exitsSeed = [
    { Id: 1, UserId: 1, LocationId: 1, ExitTime: '2024-01-01 08:30:00', EntryId: 1, Result: 'Office day shift', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 2, UserId: 2, LocationId: 2, ExitTime: '2024-01-01 08:45:00', EntryId: 2, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device002', IsDeleted: 0 },
    { Id: 3, UserId: 3, LocationId: 3, ExitTime: '2024-01-01 09:00:00', EntryId: 3, Result: 'Early Exit', IrregularBehavior: 1, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device003', IsDeleted: 0 },
    { Id: 4, UserId: 4, LocationId: 4, ExitTime: '2024-01-01 09:15:00', EntryId: 4, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device004', IsDeleted: 0 },
    { Id: 5, UserId: 5, LocationId: 5, ExitTime: '2024-01-01 09:30:00', EntryId: 5, Result: 'Late Exit', IrregularBehavior: 0, ReviewedByAdmin: 1, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device005', IsDeleted: 0 },
    { Id: 6, UserId: 6, LocationId: 6, ExitTime: '2024-01-01 09:45:00', EntryId: 6, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device006', IsDeleted: 0 },
    { Id: 7, UserId: 7, LocationId: 7, ExitTime: '2024-01-01 10:00:00', EntryId: 7, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device007', IsDeleted: 0 },
    { Id: 8, UserId: 8, LocationId: 8, ExitTime: '2024-01-01 10:15:00', EntryId: 8, Result: 'Early Exit', IrregularBehavior: 1, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device008', IsDeleted: 0 },
    { Id: 9, UserId: 9, LocationId: 9, ExitTime: '2024-01-01 10:30:00', EntryId: 9, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device009', IsDeleted: 0 },
    { Id: 10, UserId: 10, LocationId: 10, ExitTime: '2024-01-01 10:45:00', EntryId: 10, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device010', IsDeleted: 0 }
];

const selfieBlob = Buffer.from('2f396a2f34414151536b5a4a5267414241514141415141424141442f3467485953554e4458314251', 'hex');

const entriesSeed = [
    { Id: 1, UserId: 1, LocationId: 1, EntryTime: '2024-01-01 08:00:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 2, UserId: 2, LocationId: 2, EntryTime: '2024-01-01 08:15:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device002', IsDeleted: 0 },
    { Id: 3, UserId: 3, LocationId: 3, EntryTime: '2024-01-01 08:30:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device003', IsDeleted: 0 },
    { Id: 4, UserId: 4, LocationId: 4, EntryTime: '2024-01-01 08:45:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device004', IsDeleted: 0 },
    { Id: 5, UserId: 5, LocationId: 5, EntryTime: '2024-01-01 09:00:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device005', IsDeleted: 0 },
    { Id: 6, UserId: 6, LocationId: 6, EntryTime: '2024-01-01 09:15:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device006', IsDeleted: 0 },
    { Id: 7, UserId: 7, LocationId: 7, EntryTime: '2024-01-01 09:30:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device007', IsDeleted: 0 },
    { Id: 8, UserId: 8, LocationId: 8, EntryTime: '2024-01-01 09:45:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device008', IsDeleted: 0 },
    { Id: 9, UserId: 9, LocationId: 9, EntryTime: '2024-01-01 10:00:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device009', IsDeleted: 0 },
    { Id: 10, UserId: 10, LocationId: 10, EntryTime: '2024-01-01 10:15:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device010', IsDeleted: 0 },
    { Id: 11, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:05:28', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:05:28', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 12, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:15:24', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:15:24', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 13, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:23:47', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:23:47', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 14, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:34:36', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:34:36', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 15, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:37:06', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:37:06', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 16, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:38:57', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:38:57', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 17, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:39:52', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:39:52', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 18, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:22:26', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:22:26', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 19, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:22:26', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:22:26', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 20, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 11:22:26', Selfie: selfieBlob, UpdatedAt: '2025-07-12 11:22:26', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 21, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 12:53:50', Selfie: selfieBlob, UpdatedAt: '2025-07-12 12:53:50', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 22, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 12:53:50', Selfie: selfieBlob, UpdatedAt: '2025-07-12 12:53:50', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 23, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 12:53:50', Selfie: selfieBlob, UpdatedAt: '2025-07-12 12:53:50', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 24, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 12:53:50', Selfie: selfieBlob, UpdatedAt: '2025-07-12 12:53:50', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 25, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 12:53:50', Selfie: selfieBlob, UpdatedAt: '2025-07-12 12:53:50', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 26, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 16:35:27', Selfie: selfieBlob, UpdatedAt: '2025-07-12 16:35:27', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 27, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 22:54:23', Selfie: selfieBlob, UpdatedAt: '2025-07-12 22:54:23', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 28, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 22:54:23', Selfie: selfieBlob, UpdatedAt: '2025-07-12 22:54:23', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 29, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 22:54:23', Selfie: selfieBlob, UpdatedAt: '2025-07-12 22:54:23', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 30, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 22:54:23', Selfie: selfieBlob, UpdatedAt: '2025-07-12 22:54:23', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 31, UserId: 1, LocationId: 1, EntryTime: '2025-07-12 22:54:23', Selfie: selfieBlob, UpdatedAt: '2025-07-12 22:54:23', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 32, UserId: 1, LocationId: 1, EntryTime: '2025-07-14 04:13:09', Selfie: selfieBlob, UpdatedAt: '2025-07-14 04:13:09', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 33, UserId: 1, LocationId: 1, EntryTime: '2025-07-14 16:01:43', Selfie: selfieBlob, UpdatedAt: '2025-07-14 16:01:43', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 34, UserId: 1, LocationId: 1, EntryTime: '2025-07-14 17:20:26', Selfie: selfieBlob, UpdatedAt: '2025-07-14 17:20:26', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 35, UserId: 1, LocationId: 1, EntryTime: '2025-07-15 01:38:49', Selfie: selfieBlob, UpdatedAt: '2025-07-15 01:38:49', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 36, UserId: 1, LocationId: 1, EntryTime: '2025-07-15 10:23:56', Selfie: selfieBlob, UpdatedAt: '2025-07-15 10:23:56', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 37, UserId: 1, LocationId: 1, EntryTime: '2025-07-15 18:38:12', Selfie: selfieBlob, UpdatedAt: '2025-07-15 18:38:12', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 38, UserId: 1, LocationId: 1, EntryTime: '2025-07-15 19:00:47', Selfie: selfieBlob, UpdatedAt: '2025-07-15 19:00:47', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 }
];

export async function resetDatabase() {
    await knex.transaction(async (trx) => {
    await trx.raw('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of TABLES) {
        await trx(table).truncate();
    }
    await trx.raw('SET FOREIGN_KEY_CHECKS = 1');

    await trx('Roles').insert(rolesSeed);
    await trx('Users').insert(usersSeed);
    await trx('Locations').insert(locationsSeed);
    await trx('Entries').insert(entriesSeed);
    await trx('Exits').insert(exitsSeed);
    });
}

export async function closeDatabase() {
    await knex.destroy();
}