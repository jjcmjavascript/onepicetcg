const http = require('http');
const express = require('express');

module.exports = (() => {
  const server = express();
  const httpServer = http.Server(server);

  return {
    express,
    server,
    httpServer,
  };
})();
