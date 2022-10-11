require('dotenv').config();
const { server, express } =  require('../../app/services/server');
const supertest = require('supertest');

server.use(express.json()); 
server.use(express.urlencoded({
    extended: true
})); 

const app = server.listen(process.env.APP_TEST_PORT);
const client = supertest(app);

module.exports =  { app, client, server };