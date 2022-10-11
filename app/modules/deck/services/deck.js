const {decks} = require('../../../services/database');

module.exports = class Deck {
    async findAll() {
        return await decks.findAll();
    }
};