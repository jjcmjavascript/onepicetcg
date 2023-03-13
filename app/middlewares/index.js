const morgan = require('morgan');
const cookie = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const validation = require('./validation');
const passport = require("passport");
var requireAuth = passport.authenticate('jwt', {session: false});
const notFound = require('./notFound');

module.exports = {
    notFound,
    morgan,
    cookie,
    helmet,
    cors,
    validation,
    requireAuth
}
