const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');
const validate = require('../../../../shared/interfaces/rest/validate');

const { idParamSchema, entryIdParamSchema } =
  require('../../../../shared/interfaces/rest/schemas/CommonSchemas');
const { createExitSchema, updateExitSchema } =
  require('./schemas/ExitSchema');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const exit = await uc.getExitById.execute(Number(req.params.id));
      res.json(exit);
    })
  );
  
  r.get('/by-entry/:entryId',
    validate(entryIdParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const row = await uc.exitRepo.findByEntryId(Number(req.params.entryId));
      if (!row) { const e = new Error('EXIT_NOT_FOUND'); e.status = 404; throw e; }
      res.json(row);
    })
  );
  
  r.post('/',
    validate(createExitSchema, 'body'),
    asyncHandler(async (req, res) => {
      const created = await uc.registerExit.execute(req.validated);
      res.status(201).json(created);
    })
  );
  
  r.patch('/:id',
    validate(idParamSchema, 'params'),
    validate(updateExitSchema, 'body'),
    asyncHandler(async (req, res) => {
      const updated = await uc.updateExit.execute(Number(req.params.id), req.validated);
      res.json(updated);
    })
  );

  return r;
};