const { paginator, filters } = require('../../utils/helpers'); 

class DeckController {
    constructor(deckService, cardService) {        
        this.deckService = deckService;
        this.cardService = cardService;
    }

    async getAllDecks(req, res){

    }
    
    async getAllCards(req, res) {
        const {page, color} = req.query;
        const where = {};
         
        const cards = await paginator(this.cardService, {
            page,
        }); 

        return res.json([
            cards,
        ]); 
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
