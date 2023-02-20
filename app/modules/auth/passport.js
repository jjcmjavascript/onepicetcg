const passport = require('passport');
const passportJwt = require('passport-jwt');
const { where } = require('sequelize/types');
const db = require('../../services/database/models');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

passport.use(
    new StrategyJwt(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        function (jwtPayload, done) {
           return db.users.findAll({  where: {id: jwtPayload.id} })
            .then((user) => {
                return done(null, user);
            })
            .catch((err) => {
                return done(err);
            });
        }
    )
)
