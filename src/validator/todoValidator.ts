import Joi from 'joi';

export const todoValidator = Joi.object({
    title: Joi.string()
        .min(2)
        .max(10000)
        .required()
        .messages({
            'string.empty': '"title" Can not be empty',
            'string.pattern.base': 'Enter only letter min 2 max 255',
        }),
});
