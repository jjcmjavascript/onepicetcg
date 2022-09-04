const morgan = require('morgan');
const cookie = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const notFound = require('./not_found'); 

module.exports = {
    notFound,
    morgan,
    cookie,
    helmet,
    cors
}