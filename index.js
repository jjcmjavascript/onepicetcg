require('dotenv').config();
const { server, express } = require('./app/utils/services/servidor');
const routerV1 = require('./app/utils/services/servidor/router')(express);
const errorHandler = require('./app/utils/services/middlewares/errorHandler');
const manualSeeed = require('./app/utils/services/db/manualSeed');

(async ()=>{
    try {
        server.use(express.static('public'));
        server.use('/v1', routerV1);
        server.use(errorHandler);
        server.listen(80);        

      } catch (error) {
        console.error(error.stack);
      }
})();