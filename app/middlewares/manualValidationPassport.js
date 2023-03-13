const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (req, res, next) => {
  const currentRoute = req.originalUrl.replace('/v1', '');
  const currentMethod = req.method;

  const skipEval = [
    { name: '/user/login', methods: ['GET', 'POST'] },
    { name: '/user/create', methods: ['GET', 'POST'] },
    { name: '/public', methods: ['GET'] },
  ];

  console.log(req.method);

  return skipEval.some(
    (route) =>
      route.name === currentRoute && route.methods.includes(currentMethod)
  )
    ? next()
    : requireAuth(req, res, next);
};
