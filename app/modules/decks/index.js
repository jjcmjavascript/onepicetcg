module.exports = (()=>{
    const {db} = require('../../utils/services/db');
    const {cards : cardService, decks : deckService} = db; 

    const Controller = require('./deck_controller');
    const Router = require('./router');

    const controller = new Controller(deckService, cardService);
    
    const router = Router(controller);

    return { router };
})();