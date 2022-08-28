require('dotenv').config();
const { server, express } = require('./app/utils/services/servidor');
const {router: homeRouter} = require('./app/modules/decks');
const errorHandler = require('./app/utils/services/middlewares/errorHandler');
// const manualSeeed = require('./app/utils/services/db/manualSeed');

(async ()=>{
    try {
        server.use(express.static('public'));
        server.use('/home', homeRouter);
        server.use(errorHandler);
        server.listen(80);        

      } catch (error) {
        console.error(error.stack);
      }
})();