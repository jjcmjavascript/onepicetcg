module.exports = (()=>{
    const db = require('../../services/database');
    
    const Controller = require('./controller');
    const controller = new Controller(db);
    
    const routes = require('./routes')(controller);

    return routes;
})();