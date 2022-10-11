class DeckController {
    constructor(
        paramsFormatter,
        decks,
        cards,
        colors,
        packs,
    ){       
        this.paramsFormatter = paramsFormatter;
        this.deckServices = decks;
        this.cardServices = cards;
        this.coloServices = colors;
        this.packServices = packs;
    }
    
    async getAllCards(request, response) {
        const query = this.paramsFormatter
        .setAndValidateRequest(request)
        .setRegExp([/^\w+$/])
        .setAllowed(['id', 'name', 'page', 'color'])
        .fromQuery()
        .get(); 
        
        const cards = await this.cardServices.paginate(query); 
                
        return response.status(200).json(cards); 
    }

    async getAllDecks(request, response){

    }
    
    async getCardSelects(_, response){
        const costs = Array(10).fill(0).map((_,k) => k + 1);
        const attacks = Array(10).fill(0).map((_,k) => (k + 1) * 1000); 
        const colors = await this.coloServices.findAll(
            {attributes: ['name', 'id']}
        );
        const packs = await this.packServices.findAll({
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
