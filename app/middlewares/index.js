const morgan = require('morgan');
const cookie = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const validation = require('./validation');
const notFound = require('./notFound');
const manualValidationPassport = require('./manualValidationPassport');

module.exports = {
  notFound,
  morgan,
  cookie,
  helmet,
  cors,
  validation,
  manualValidationPassport,
};
