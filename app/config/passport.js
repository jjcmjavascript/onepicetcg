const passport = require('passport');
const passportJwt = require('passport-jwt');
const db = require('../services/database/models');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };
    passport.use(new StrategyJwt(opts, function (jwt_payload, callback) {
        db.findUser({email: jwt_payload.user_email}, function (res) {
            var user = res;
            delete user.password;
            callback(null, user);
        }, function (err) {
            return callback(err, false);
        });
    }));
};
