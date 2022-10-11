const  { v1 } = require('../app/routes'); 
const {client, app, server} = require('./services/expressClientAndServer');
server.use('/v1',  v1);

describe('Module Deck Tests', ()=>{
    test.skip('Get all cards', async ()=>{
        await client.get('/v1/cards')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('Card should return array empty when id is null', async ()=>{
        let result = await client.get('/v1/cards?id=null');
        const {body} = result;
        const cards = body.rows; 

        expect(cards).toHaveLength(0);
    });

    test('Card should return array with filter name ', async ()=>{
        const cardName = 'Oden';
        const reg = new RegExp(cardName, 'i'); 

        const result = await client.get('/v1/cards?name='+cardName)

        const cards = result.body.rows; 
        
        expect(cards[0].name).toMatch(reg);
    });

    
    test('Selects endpont should have objects and especifics filters', async ()=>{
        const selectsNames = ['colors', 'packs', 'attacks', 'costs']; 

        const result = await client.get('/v1/cards/selects')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        const selects = result.body; 
        
        expect(Object.keys(selects))
            .toHaveLength(selectsNames.length); 

        selectsNames.forEach(selectName =>{
            expect(typeof selects[selectName]).toBe('object');
        }); 
    }); 
});

afterAll(()=>{
    app.close();
});


