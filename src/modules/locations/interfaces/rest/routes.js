const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');
const validate = require('../../../../shared/interfaces/rest/validate');

const { idParamSchema, codeParamSchema, paginationQuerySchema } =
  require('../../../../shared/interfaces/rest/schemas/CommonSchemas');
const { createLocationSchema, updateLocationSchema } =
  require('./schemas/LocationSchema');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
      const page = req.validated?.page ?? 1;
      const pageSize = req.validated?.pageSize ?? 50;
      const { items, total } = await uc.locationRepo.listPage({ page, pageSize });
      res.json({ items, page, pageSize, total });
    })
  );

  r.get('/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const loc = await uc.getLocation.execute(Number(req.params.id));
      res.json(loc);
    })
  );
  
  r.get('/code/:code',
    validate(codeParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const row = await uc.locationRepo.findByCode(req.params.code);
      if (!row) { const e = new Error('LOCATION_NOT_FOUND'); e.status = 404; throw e; }
      res.json(row);
    })
  );
  
  r.post('/',
    validate(createLocationSchema, 'body'),
    asyncHandler(async (req, res) => {
      const created = await uc.createLocation.execute(req.validated);
      res.status(201).json(created);
    })
  );
  
  r.patch('/:id',
    validate(idParamSchema, 'params'),
    validate(updateLocationSchema, 'body'),
    asyncHandler(async (req, res) => {
      const updated = await uc.updateLocation.execute(Number(req.params.id), req.validated);
      res.json(updated);
    })
  );

  return r;
};