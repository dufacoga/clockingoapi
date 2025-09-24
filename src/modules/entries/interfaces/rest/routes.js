const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/:id', asyncHandler(async (req, res) => {
    const entry = await uc.getEntryById.execute(Number(req.params.id));
    res.json(entry);
  }));
  
  r.get('/last/:userId', asyncHandler(async (req, res) => {
    const result = await uc.getLastEntryByUser.execute(Number(req.params.userId));
    res.json(result);
  }));
  
  r.post('/', asyncHandler(async (req, res) => {
    const created = await uc.registerEntry.execute(req.body);
    res.status(201).json(created);
  }));

  r.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await uc.updateEntry.execute(Number(req.params.id), req.body);
    res.json(updated);
  }));

  return r;
};