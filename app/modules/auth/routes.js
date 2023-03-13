const { validation, requireAuth } = require('../../middlewares');
const schemas = require('./schemas');

module.exports = (controller) => {
    return [
      {
        method: 'post',
        path: '/user/login',
        middlewares: [validation(schemas.loginSchema, 'body')],
        handler: async (req, res) => controller.login(req, res),
      },
      {
        method: 'post',
        path: '/user/create',
        middlewares: [validation(schemas.createSchema, 'body')],
        handler: async (req, res) => controller.create(req, res),
      },
      {
        method: 'get',
        path: '/user/list',
        middlewares: [requireAuth],
        handler: async (req, res) => controller.getAll(req, res),
      },
    ]
}