const {cards} = require('../../../services/database');
const { paginator , ParamsFormatter} = require('../../../utils'); 

module.exports = class CardServices {
    constructor(){
        this.db = cards;
    }

    async paginate(query){
        const { page } = query;
        const cards = await paginator(this.db.scope( { method: ['fromQuery', query] }),{
            page, 
            include: [ '_colors', '_image', '_image_full']
        });

        return cards;    
    }    
}