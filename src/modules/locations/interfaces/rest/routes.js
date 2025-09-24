const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/:id', asyncHandler(async (req, res) => {
    const loc = await uc.getLocation.execute(Number(req.params.id));
    res.json(loc);
  }));
  
  r.get('/code/:code', asyncHandler(async (req, res) => {
    const row = await uc.locationRepo.findByCode(req.params.code);
    if (!row) { const e = new Error('LOCATION_NOT_FOUND'); e.status = 404; throw e; }
    res.json(row);
  }));
  
  r.post('/', asyncHandler(async (req, res) => {
    const created = await uc.createLocation.execute(req.body);
    res.status(201).json(created);
  }));
  
  r.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await uc.updateLocation.execute(Number(req.params.id), req.body);
    res.json(updated);
  }));

  return r;
};