const { paginator, filters } = require('../../helpers'); 

class DeckController {
    constructor({cards : cardService, decks : deckService}) {        
        this.deckService = deckService;
        this.cardService = cardService;
    }
    
    async getAllCards(req, res) {
        const {page, color} = req.query;
        const where = {};
         
        const cards = await paginator(this.cardService, {
            page,
        }); 

        return res.json(cards); 
    }

    async getAllDecks(req, res){

    }
    
    getCard(id) {
        return this.cardService.getCard(id);
    }
    createCard(card) {
        return this.cardService.createCard(card);
    }
    updateCard(card) {
        return this.cardService.updateCard(card);
    }
    deleteCard(id) {
        return this.cardService.deleteCard(id);
    }
};

module.exports = DeckController;
