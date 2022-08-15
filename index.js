require('dotenv').config();
const { server, express } = require('./app/utils/services/servidor');
const routerV1 = require('./app/utils/services/servidor/router')(express);

(async ()=>{
    server.use('/v1', routerV1);
    server.listen(80);    
})();