class GetLocationUseCase {
  constructor({ locationRepo }) { this.locationRepo = locationRepo; }
  async execute({ id = null, code = null }) {
    let loc = null;
    if (id != null) loc = await this.locationRepo.findById(id);
    if (!loc && code) loc = await this.locationRepo.findByCode(code);
    if (!loc) {
      const e = new Error('LOCATION_NOT_FOUND'); e.status = 404; throw e;
    }
    return loc;
  }
}
module.exports = GetLocationUseCase;