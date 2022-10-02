const { Router } = require('express')
const decks_routes  = require('../modules/deck');
let router = Router(); 

[...decks_routes ].forEach(({method, path, handler}) => {
    router[method](path, handler); 
});

module.exports = router;
