const  { v1 } = require('../app/routes');
const {client, app, server} = require('./services/expressClient')('/v1', v1);
server.use('/v1',  v1);

describe('Module Deck Tests', ()=>{
    test('Get all cards', async ()=>{
        await client.get('/v1/deck/create')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('Filter: get card with ID null', async ()=>{
        let result = await client.get('/v1/deck/create?id=null');
        const {body} = result;
        const cards = body.rows;

        expect(cards).toHaveLength(0);
    });
});

afterAll(()=>{
    app.close();
});


