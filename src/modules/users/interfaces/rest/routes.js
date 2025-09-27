const { Router } = require('express');
const asyncHandler = require('../../../../shared/interfaces/rest/asyncHandler');
const validate = require('../../../../shared/interfaces/rest/validate');

const { idParamSchema, usernameParamSchema, paginationQuerySchema } =
  require('../../../../shared/interfaces/rest/schemas/CommonSchemas');
const { createUserSchema, updateUserSchema } =
  require('./schemas/UserSchema');

module.exports = (uc) => {
  const r = Router();
  
  r.get('/',
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
      const page = req.validated?.page ?? 1;
      const pageSize = req.validated?.pageSize ?? 50;
      const { items, total } = await uc.userRepo.listPage({ page, pageSize });
      res.json({ items, page, pageSize, total });
    })
  );

  r.get('/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const user = await uc.getUserById.execute(Number(req.params.id));
      res.json(user);
    })
  );
  
  r.get('/username/:username',
    validate(usernameParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const user = await uc.getUserByUsername.execute(req.params.username);
      res.json(user);
    })
  );
  
  r.post('/',
    validate(createUserSchema, 'body'),
    asyncHandler(async (req, res) => {
      const created = await uc.createUser.execute(req.validated);
      res.status(201).json(created);
    })
  );

  r.patch('/:id',
    validate(idParamSchema, 'params'),
    validate(updateUserSchema, 'body'),
    asyncHandler(async (req, res) => {
      const updated = await uc.updateUser.execute(Number(req.params.id), req.validated);
      res.json(updated);
    })
  );

  return r;
};