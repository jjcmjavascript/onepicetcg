const { validation } = require('../../middlewares');
const schemas = require('./schemas');

module.exports = (controller) => {
  return [
    {
      method: 'get',
      path: '/deck',
      handler: async (req, res) => controller.getAllDecks(req, res),
    },
    {
      method: 'post',
      path: '/deck',
      middlewares: [validation(schemas.createSchema, 'body')],
      handler: async (req, res) => controller.saveDeck(req, res),
    },
    {
      method: 'get',
      path: '/deck/create',
      handler: async (req, res) => controller.getAllCards(req, res),
    },
    {
      method: 'get',
      path: '/deck/create/filters',
      handler: async (req, res) => controller.getFilters(req, res),
    },
  ];
};
