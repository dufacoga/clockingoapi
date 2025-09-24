class IUserRepository {
  async findById(id)              { throw new Error('Not implemented'); }
  async findByUsername(username)  { throw new Error('Not implemented'); }
  async create(user)              { throw new Error('Not implemented'); }
  async updatePartial(id, patch)  { throw new Error('Not implemented'); }
  async softDelete(id)            { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;