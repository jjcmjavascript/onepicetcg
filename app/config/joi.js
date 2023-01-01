const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  errors: { language: 'es' },
  messages: {
    es: {
      'any.required': ' es requerido',
      'number.base': ' debe ser un número. ',
      'string.base': ' debe ser de tipo texto. ',
      'number.max': ' tiene una longitud que debe ser menor o igual a ',
      'string.max': ' tiene una longitud que debe ser menor o igual a ',
      'array.max': ' tiene una longitud que debe ser menor o igual a ',
      'array.required': ' es requerido',
      'array.base': ' debe ser un array. ',
    },
  },
};

module.exports = validationOptions;
