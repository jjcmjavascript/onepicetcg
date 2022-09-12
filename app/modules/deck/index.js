module.exports = (()=>{    
    const Controller = require('./controller');
    const controller = new Controller();
    const routes = require('./routes')(controller);

    return routes;
})();