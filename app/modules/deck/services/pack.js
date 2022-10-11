const {packs} = require('../../../services/database');

module.exports = class Pack {
    async findAll() {
        return await packs.findAll();
    }
};