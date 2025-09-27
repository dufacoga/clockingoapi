const ExitRepository = require('../../infrastructure/persistence/maria/ExitRepository');

const GetExitByIdUseCase = require('../../application/usecases/GetExitByIdUseCase');
const RegisterExitUseCase = require('../../application/usecases/RegisterExitUseCase');
const UpdateExitUseCase = require('../../application/usecases/UpdateExitUseCase');

module.exports = function build() {
  const exitRepo = new ExitRepository();

  return {
    getExitById: new GetExitByIdUseCase({ exitRepo }),
    registerExit: new RegisterExitUseCase({ exitRepo }),
    updateExit: new UpdateExitUseCase({ exitRepo }),
    exitRepo
  };
};