const { faker } = require('@faker-js/faker');

/**
 * @param {Object|Array} item
 * @returns {Object|Array}
 */
function setUuid(item) {
  if (Array.isArray(item)) {
    return item.map((i) => setUuid(i));
  }

  return {
    ...item,
    uuid: faker.datatype.uuid(),
  };
}

module.exports = setUuid;
