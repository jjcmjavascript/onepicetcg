const db = require('../../services/database');

const { paginator, ParamsFormatter } = require('../../helpers'); 

class DeckController {
    constructor() {        
        this.deckService = db.decks;
        this.cardService = db.cards;
        this.colorService = db.colors;
        this.packsService = db.packs;
    }
    
    async getAllCards(request, response) {
        const {page} = request.query;

        const where = new ParamsFormatter()
            .validateAndSetRequest(request)
            .setAllowed(['id'])
            .fromQuery()
            .get();
        
        const cards = await paginator(this.cardService, {
            page,
            where,
            include: [
                '_colors', '_image', '_image_full'
            ]
        }); 

        return response.status(200).json(cards); 
    }

    async getAllDecks(request, response){

    }
    
    async getCardSelects(_, response){
        const costs = Array(10).fill(0).map((_,k) => k + 1);
        const attacks = Array(10).fill(0).map((_,k) => (k + 1) * 1000); 
        const colors = await this.colorService.findAll(
            {attributes: ['name', 'id']}
        );
        const packs = await this.packsService.findAll({
            attributes: ['name', 'code', 'id'],
        }) 
        
        return response.json({
            colors, 
            costs,
            attacks,
            packs
        });
    }
};

module.exports = DeckController;
