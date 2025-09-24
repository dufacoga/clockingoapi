const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');
const validate = require('../../../../shared/interfaces/rest/validate');

const { idParamSchema, userIdParamSchema } =
  require('../../../../shared/interfaces/rest/schemas/CommonSchemas');
const { createEntrySchema, updateEntrySchema } =
  require('./schemas/EntrySchema');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const entry = await uc.getEntryById.execute(Number(req.params.id));
      res.json(entry);
    })
  );
  
  r.get('/last/:userId',
    validate(userIdParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const result = await uc.getLastEntryByUser.execute(Number(req.params.userId));
      res.json(result);
    })
  );
  
  r.post('/',
    validate(createEntrySchema, 'body'),
    asyncHandler(async (req, res) => {
      const created = await uc.registerEntry.execute(req.validated);
      res.status(201).json(created);
    })
  );
  
  r.patch('/:id',
    validate(idParamSchema, 'params'),
    validate(updateEntrySchema, 'body'),
    asyncHandler(async (req, res) => {
      const updated = await uc.updateEntry.execute(Number(req.params.id), req.validated);
      res.json(updated);
    })
  );

  return r;
};