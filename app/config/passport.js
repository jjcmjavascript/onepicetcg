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
        console.log(jwt_payload);
        db.users.findAll({
			where: {
				email: jwt_payload.email
			}
		}).then( data => {
            var user = data;
            delete user.password;
            callback(null, user);
        }).catch( err => {
            return callback(err, false);
        });
    
    }));
};
