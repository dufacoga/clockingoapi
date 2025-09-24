class ILocationRepository {
  async findById(id) { throw new Error('Not implemented'); }

  async findByCode(code) { throw new Error('Not implemented'); }

  async create(location) { throw new Error('Not implemented'); }
}

module.exports = ILocationRepository;