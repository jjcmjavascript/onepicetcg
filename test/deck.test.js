require('dotenv').config();
const supertest = require('supertest');
const { server, express } =  require('../app/services/server');
const routes = require('../app/modules/deck'); 

const router = express.Router();
routes.forEach(({method, path, handler}) => {
    router[method](path, handler); 
});

server.use('/v1', router); 
server.use(express.json()); 
const app = server.listen(process.env.APP_TEST_PORT);
const api_client = supertest(app)

describe('Module Deck Tests', ()=>{
    test('Get all cards', async ()=>{
        await api_client.get('/v1/cards')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('Filter: get card with ID null', async ()=>{
        let result = await api_client.get('/v1/cards?id=null');
        const {body} = result;
        const cards = body.rows; 

        expect(cards).toHaveLength(0);
    });

    // test('Filter: get card with ID 1', async ()=>{
    //     let result = await api_client.get('/v1/cards?id=1');
    //     const {body} = result;
    //     const cards = body.rows; 

    //     expect(cards).toHaveLength(1);
    //     expect(cards[0].id).toBe(1);
    // });


});

afterAll(()=>{
    app.close();
});


