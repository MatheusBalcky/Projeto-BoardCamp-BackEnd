import Joi from 'joi';

export const gameSchema = Joi.object({
    name: Joi.string().min(1).required(),
    image: Joi.string(),
    stockTotal: Joi.number().min(1),
    categoryId: Joi.number(),
    pricePerDay: Joi.number().min(1)
})

export const clientSchema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf: Joi.string().min(11).max(11).required(),
    birthday: Joi.string().isoDate()
})

