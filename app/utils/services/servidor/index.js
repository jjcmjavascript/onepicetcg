module.exports = (()=>{
    const https = require('https');
    const express = require('express'); 
    
    const server = express();
    const httpServer  =  https.createServer(server);

    return {
        https,
        express,
        httpServer,
        server
    }
})(); 
