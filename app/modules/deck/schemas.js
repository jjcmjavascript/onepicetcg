const joi = require('joi');

const id = joi.number().integer().min(1).required();
const name = joi.string().min(3).max(50).required();
const cards = joi.array().items(id).max(52).required();

const createSchema = joi.object({
  name,
  cards,
});

const deleteSchema = joi.object({
  id,
});

const updateSchema = joi.object({
  id,
  name,
  cards,
});

module.exports = {
  createSchema,
  deleteSchema,
  updateSchema
};
