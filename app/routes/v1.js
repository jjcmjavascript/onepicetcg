const { Router } = require("express");
const decks_routes = require("../modules/deck");
const auth_routes = require("../modules/auth");
let router = Router();

[...decks_routes, ...auth_routes].forEach(({ method, path, middlewares = [],  handler }) => {
  router[method](path, ...middlewares, handler);
});


module.exports = router;
