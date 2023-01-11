const db = require('./database');

module.exports = {
  attacks: Array(10)
    .fill(0)
    .map((_, k) => k * 1000),

  costs: Array(11)
    .fill(0)
    .map((_, k) => k + 1),

  colors: async () => await db.colors.findAll(),

  packs: async () => await db.packs.findAll(),

  types: async () => await db.types.findAll(),

  categories: async () => await db.categories.findAll(),
};
