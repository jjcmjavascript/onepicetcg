const { Router } = require("express");
const decks_routes = require("../modules/deck");
let router = Router();

[...decks_routes].forEach(({ method, path, middlewares = [],  handler }) => {
  router[method](path, ...middlewares, handler);
});

module.exports = router;
