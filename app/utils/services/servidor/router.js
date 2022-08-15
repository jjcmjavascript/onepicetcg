module.exports = (servidor) => {
    const path = require('path');
    const routerV1 = servidor.Router();
    const { green, red, blue, purple, dons
        , leaders
        , characters
        , events
        , stages
        , don_name } = require('../../../../../urls');
        
    routerV1.use('/cards', (req, res) => {
        return res.json({
            'cards': [...green, ...blue, ...purple, ...red],
        });
    });

    return routerV1;
};


