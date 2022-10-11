const { ParamsFormatter} = require('../../utils'); 
const Controller = require('./controller');
const Card = require('./services/card');
const Deck = require('./services/Deck');
const Color = require('./services/Color');
const Pack = require('./services/Pack');

module.exports = (()=>{    
    const controller = new Controller(new ParamsFormatter, new Deck, new Card, new Color, new Pack);
    const routes = require('./routes')(controller);

    return routes;
})();