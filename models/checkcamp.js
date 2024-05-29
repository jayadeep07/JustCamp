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