module.exports = (()=>{
    const db = require('../../services/database');

    const Controller = require('./controller');
    const controller = new Controller(db);
    
    const Router = require('./router');
    const router = Router(controller);

    return router;
})();