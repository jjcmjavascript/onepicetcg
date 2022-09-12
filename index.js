require('dotenv').config();
const {server, express} = require('./app/services/server');
const {notFound, helmet, morgan, cors} = require('./app/middlewares');
const {v1} = require('./app/routes');

(async ()=>{
    try {
        server.use(express.static('public'));
        server.use(cors());
        server.use(helmet()); 
        server.use(express.json({limit : '2mb'})); 
        server.use(express.urlencoded({extended: false, limit: '2mb', parameterLimit: 100})); 
        server.use(morgan('tiny')); 

        server.use('/v1', v1); 
        
        server.listen(process.env.APP_PORT, ()=>{
          console.log(`Listening on port ${process.env.APP_PORT}`);
        });        
      } catch (error) {
        console.error(error.stack);
      }
})();

