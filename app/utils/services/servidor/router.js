module.exports = (servidor) => {
    const routerV1 = servidor.Router();
    const { db } = require('../../services/db');

    const { green, red, blue, purple, dons
        , leaders
        , characters
        , events
        , stages
        , don_name } = require('../../../../../urls');
        
    routerV1.use('/cards', (req, res) => {
        return res.json({
            'cards': [...green, ...blue, ...purple, ...red, ...dons],
        });
    });

    routerV1.use('/leaders', async (req, res) => {
        const cards = await db.cards.findAll({
            where: {
                type_id: 5,
            },
            include: ['_image', '_image_full'],
        }, {
            
        });

        return res.json({
            cards
        });
    });

    routerV1.use('/characters', (req, res) => {
        return res.json({
            'cards': characters,
        });
    });
    
    routerV1.use('/events', (req, res) => {
        return res.json({
            'cards': events,
        });
    });

    routerV1.use('/stages', (req, res) => {
        return res.json({
            'cards': stages,
        });
    });

    routerV1.use('/don_name', (req, res) => {
        return res.json({
            'cards': don_name,
        });
    });

    return routerV1;
};


