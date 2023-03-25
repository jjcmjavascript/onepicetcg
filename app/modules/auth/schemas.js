const joi = require('joi');

const name = joi.string().min(3).max(50).required();
const email = joi.string().min(3).max(50).required();
const password = joi.string().min(4).max(50).required();

const loginSchema = joi.object({
    email,
    password,
});

const createSchema = joi.object({
    name,
    email,
    password,
})

module.exports = {
    loginSchema,
    createSchema,
}