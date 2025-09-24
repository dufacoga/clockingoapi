const EntryRepository = require('../../infrastructure/persistence/maria/EntryRepository');

const GetEntryByIdUseCase = require('../../application/usecases/GetEntryByIdUseCase');
const GetLastEntryByUserUseCase = require('../../application/usecases/GetLastEntryByUserUseCase');
const RegisterEntryUseCase = require('../../application/usecases/RegisterEntryUseCase');
const UpdateEntryUseCase = require('../../application/usecases/UpdateEntryUseCase');

module.exports = function build() {
  const entryRepo = new EntryRepository();

  return {
    getEntryById: new GetEntryByIdUseCase({ entryRepo }),
    getLastEntryByUser: new GetLastEntryByUserUseCase({ entryRepo, exitRepo: null }),
    registerEntry: new RegisterEntryUseCase({ entryRepo }),
    updateEntry: new UpdateEntryUseCase({ entryRepo }),
    setExitRepo(exitRepo) {
      this.getLastEntryByUser = new GetLastEntryByUserUseCase({ entryRepo, exitRepo });
    }
  };
};