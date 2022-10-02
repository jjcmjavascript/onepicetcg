require('dotenv').config();
const { server, express } =  require('../../app/services/server');
const supertest = require('supertest');

module.exports = ()=>{
    server.use(express.json()); 

    const app = server.listen(process.env.APP_TEST_PORT);
    const client = supertest(app);

    return { app, client, server};
}
