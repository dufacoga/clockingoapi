const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/:id', asyncHandler(async (req, res) => {
    const user = await uc.getUserById.execute(Number(req.params.id));
    res.json(user);
  }));
  
  r.get('/username/:username', asyncHandler(async (req, res) => {
    const user = await uc.getUserByUsername.execute(req.params.username);
    res.json(user);
  }));
  
  r.post('/', asyncHandler(async (req, res) => {
    const created = await uc.createUser.execute(req.body);
    res.status(201).json(created);
  }));
  
  r.patch('/:id', asyncHandler(async (req, res) => {
    const updated = await uc.updateUser.execute(Number(req.params.id), req.body);
    res.json(updated);
  }));

  return r;
};