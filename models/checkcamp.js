const joi = require("joi")
module.exports.campschema = joi.object({
    camp: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().required()
    }).required()
}).required()

module.exports.reviewschema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5),
        text: joi.string().required()
    }).required()
}).required()

module.exports.userschema = joi.object({
    username: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
    password: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
        })
}).required()