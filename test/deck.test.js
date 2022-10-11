const  { v1 } = require('../app/routes'); 
const {client, app, server} = require('./services/expressClientAndServer');
server.use('/v1',  v1);

describe('Module Deck Tests', ()=>{
    test('Get all cards', async ()=>{
        await client.get('/v1/cards')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('Card should return array empty when id is null', async ()=>{
        let result = await client.get('/v1/cards?color=3');
        const {body} = result;
        const cards = body.rows; 

        expect(cards).toHaveLength(0);
    });

    // test('Card should return array with filter name ', async ()=>{
    //     const cardName = 'Oden';

    //     let result = await client.get('/v1/cards?name=Oden');
    //     const {body} = result;

    //     const cards = body.rows; 

    //     expect(cards[0].name.toLowerCase().trim()).toBe('Oden'.toLowerCase());
    // });

    
    // test('Selects endpont should have objects and especifics filters', async ()=>{
    //     const selectsNames = ['colors', 'packs', 'attacks', 'costs']; 

    //     const result = await client.get('/v1/cards/selects')
    //         .expect(200)
    //         .expect('Content-Type', /application\/json/);
        
    //     const selects = result.body; 
        
    //     expect(Object.keys(selects))
    //         .toHaveLength(selectsNames.length); 

    //     selectsNames.forEach(selectName =>{
    //         expect(typeof selects[selectName]).toBe('object');
    //     }); 
    // }); 
});

afterAll(()=>{
    app.close();
});


