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
    { Id: 5, Name: 'Eve Davis', Phone: '555-2002', Username: 'edavis', AuthToken: 'auth102worker', RoleId: 2, IsDeleted: 0 }
];

const locationsSeed = [
    { Id: 1, Code: 'NGQ1MzQxNzQ0OTQ0NDU3OTRkNzk0MjRlNTk1NzZjNzU0OTQ2NGUzMDQ5NDMzMDY3NTUzMzQyNzk2MTU3MzU2ZTVhNmQ2YzZjNjI0NzUyN2E=', Address: '123 Main St', City: 'Springfield', CreatedBy: 1, IsCompanyOffice: 1, IsDeleted: 0 },
    { Id: 2, Code: 'NGQ2OTQxNzQ0OTQ0NTEzMTRlNjk0MjU4NTk1ODRhNmM2MTQ3MzkzMTYzMzI1NTY3NTE1ODVhNmM0OTQzMzA2NzU0NTc1NjMwNjM2ZDM5Nzc2MjMyNzg3MDYzNzczZDNk', Address: '456 Warehouse Ave', City: 'Metropolis', CreatedBy: 2, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 3, Code: 'NGQ3OTQxNzQ0OTQ0NjMzNDRmNTM0MjQzNjM2ZDQ2NzU1OTMyNjc2NzU1NmQ1MTY3NGM1MzQyNDg2MjMzNTI2ZjU5NTczMDNk', Address: '789 Branch Rd', City: 'Gotham', CreatedBy: 3, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 4, Code: 'NGU0MzQxNzQ0OTQ0NDU3NzRkNTM0MjUwNWE2ZDVhNzA1OTMyNTU2NzU1NDc0Njc5NjE3OTQxNzQ0OTQ2NGUzMDU5NTg0OTY3NTEzMjZjMzA2NTUxM2QzZA==', Address: '101 Office Park', City: 'Star City', CreatedBy: 4, IsCompanyOffice: 0, IsDeleted: 0 },
    { Id: 5, Code: 'NGU1MzQxNzQ0OTQ0NDk3NzRkNjk0MjUzNWE1ODRlNmM1OTU4NGE2YTYxNDM0MjQzNjI0ODVhNmI0OTQzMzA2NzUxMzI1Njc1NjQ0ODRhNjg2MjQzNDI0NDYxNTg1MjM1', Address: '202 Research Blvd', City: 'Central City', CreatedBy: 5, IsCompanyOffice: 0, IsDeleted: 0 }
];

const exitsSeed = [
    { Id: 1, UserId: 1, LocationId: 1, ExitTime: '2024-01-01 08:30:00', EntryId: 1, Result: 'Office day shift', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 2, UserId: 2, LocationId: 2, ExitTime: '2024-01-01 08:45:00', EntryId: 2, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device002', IsDeleted: 0 },
    { Id: 3, UserId: 3, LocationId: 3, ExitTime: '2024-01-01 09:00:00', EntryId: 3, Result: 'Early Exit', IrregularBehavior: 1, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device003', IsDeleted: 0 },
    { Id: 4, UserId: 4, LocationId: 4, ExitTime: '2024-01-01 09:15:00', EntryId: 4, Result: 'Normal', IrregularBehavior: 0, ReviewedByAdmin: 0, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 0, DeviceId: 'Device004', IsDeleted: 0 },
    { Id: 5, UserId: 5, LocationId: 5, ExitTime: '2024-01-01 09:30:00', EntryId: 5, Result: 'Late Exit', IrregularBehavior: 0, ReviewedByAdmin: 1, UpdatedAt: '2025-06-20 19:53:01', IsSynced: 1, DeviceId: 'Device005', IsDeleted: 0 }
];

const selfieBlob = Buffer.from('2f396a2f34414151536b5a4a5267414241514141415141424141442f3467485953554e4458314251', 'hex');

const entriesSeed = [
    { Id: 1, UserId: 1, LocationId: 1, EntryTime: '2024-01-01 08:00:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device001', IsDeleted: 0 },
    { Id: 2, UserId: 2, LocationId: 2, EntryTime: '2024-01-01 08:15:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device002', IsDeleted: 0 },
    { Id: 3, UserId: 3, LocationId: 3, EntryTime: '2024-01-01 08:30:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device003', IsDeleted: 0 },
    { Id: 4, UserId: 4, LocationId: 4, EntryTime: '2024-01-01 08:45:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device004', IsDeleted: 0 },
    { Id: 5, UserId: 5, LocationId: 5, EntryTime: '2024-01-01 09:00:00', Selfie: selfieBlob, UpdatedAt: '2025-06-20 14:46:48', IsSynced: 1, DeviceId: 'Device005', IsDeleted: 0 }
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