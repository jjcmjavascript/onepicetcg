require('dotenv').config();

const {server, express} = require('./app/services/server');
const {notFound, helmet, morgan} = require('./app/middlewares');
const router = require('./app/routes');

// const manualSeeed = require('./app/utils/services/db/manualSeed');

(async ()=>{
    try {

        server.use(express.static('public'));
        server.use(express.json()); 
        server.use(helmet()); 
        server.use(morgan('tiny')); 
        server.use(express.urlencoded({extended: false})); 

        server.use(router.decks); 

        //server.use(notFound);
        server.listen(80);        

      } catch (error) {
        console.error(error.stack);
      }
})();