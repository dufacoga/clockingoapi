const { z } = require("zod");

const createRoleSchema = z.object({
  Name: z.string().min(1).max(50)
});

module.exports = {
  createRoleSchema
};