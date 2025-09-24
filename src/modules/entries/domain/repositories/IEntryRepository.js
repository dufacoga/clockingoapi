class IEntryRepository {
  async findById(id) { throw new Error('Not implemented'); }

  async create(entry) { throw new Error('Not implemented'); }

  async findLastByUser(userId) { throw new Error('Not implemented'); }
}

module.exports = IEntryRepository;