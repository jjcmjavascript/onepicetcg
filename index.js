require('dotenv').config();

const { server, express } = require('./app/utils/services/servidor');
const {router: homeRouter} = require('./app/modules/decks');
const {notFound} = require('./app/utils/services/middlewares');
// const manualSeeed = require('./app/utils/services/db/manualSeed');

(async ()=>{
    try {
        server.use(express.static('public'));
        server.use('/home', homeRouter);
        server.use(notFound);
        server.listen(80);        

      } catch (error) {
        console.error(error.stack);
      }
})();