const Joi = require('joi');

const validSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .required()
        .min(3),

    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    mobile:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
})

module.exports = {validSchema}