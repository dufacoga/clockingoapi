const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/:id', asyncHandler(async (req, res) => {
    const exit = await uc.getExitById.execute(Number(req.params.id));
    res.json(exit);
  }));
  
  r.get('/by-entry/:entryId', asyncHandler(async (req, res) => {
    const row = await uc.exitRepo.findByEntryId(Number(req.params.entryId));
    if (!row) {
      const e = new Error('EXIT_NOT_FOUND'); e.status = 404; throw e;
    }
    res.json(row);
  }));
  
  r.post('/', asyncHandler(async (req, res) => {
    const created = await uc.registerExit.execute(req.body);
    res.status(201).json(created);
  }));
  
  r.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await uc.updateExit.execute(Number(req.params.id), req.body);
    res.json(updated);
  }));

  return r;
};