const https = require('https');
const express = require('express'); 

module.exports = (()=>{
    const server = express();
    const httpServer  =  https.createServer(server);

    return {
        https,
        express,
        server,
        httpServer
    }
})(); 
