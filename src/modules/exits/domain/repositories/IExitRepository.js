class IExitRepository {
  async findById(id)           { throw new Error('Not implemented'); }
  async create(exitEntity)     { throw new Error('Not implemented'); }
  async findByEntryId(entryId) { throw new Error('Not implemented'); }
  async softDelete(id)         { throw new Error('Not implemented'); }
}

module.exports = IExitRepository;