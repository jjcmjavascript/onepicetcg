require('dotenv').config();
const {server, express} = require('./app/services/server');
const {notFound, helmet, morgan, cors} = require('./app/middlewares');
const routes = require('./app/routes');

const downloadImage = require("./app/scripts/image_scrapper");

(async ()=>{
    try {
        downloadImage("rojo",  "https://nakamadecks.com/imgs/cards/little/OP01-060.png");
        server.use(express.static('public'));
        server.use(cors());
        server.use(helmet()); 
        server.use(express.json({limit : '2mb'})); 
        server.use(express.urlencoded({extended: false, limit: '2mb', parameterLimit: 100})); 
        server.use(morgan('tiny')); 
        server.use(routes); 
        server.listen(80);        

      } catch (error) {
        console.error(error.stack);
      }
})();