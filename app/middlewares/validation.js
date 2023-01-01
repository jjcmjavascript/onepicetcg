const joiConfig = require('../config/joi');

const fortmatJoiError = (error) => {
  const { details } = error;

  const message = details.reduce((prev, next) => {
    const name = Array.isArray(next.path) ? next.path[0] : next.path;

    prev[name] = `${name}:${next.message}`;

    return prev;
  }, {});

  return message;
};

const validationWithValidation = (joiSchema, where = 'body') => {
  return (req, res, next) => {
    const { error } = joiSchema.validate(req[where] || {}, joiConfig);

    if (error) {
      return res.status(422).json({ errors: fortmatJoiError(error) });
    }

    next();
  };
};

module.exports = validationWithValidation;
