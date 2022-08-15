module.exports = (()=>{
    const https = require('https');
    const expressApp = require('express'); 
    const httpServer  =  https.createServer(expressApp);
    
    return {
        httpServer,
        expressApp
    }
})(); 




