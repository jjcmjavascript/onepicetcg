const {colors} = require('../../../services/database');

module.exports = class Color {
    async findAll() {
        return await colors.findAll();
    }
}