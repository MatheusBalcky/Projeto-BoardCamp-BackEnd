import Joi from 'joi';

export const gameSchema = Joi.object({
    name: Joi.string().min(1).required(),
    image: Joi.string(),
    stockTotal: Joi.number().min(1),
    categoryId: Joi.number(),
    pricePerDay: Joi.number().min(1)
})