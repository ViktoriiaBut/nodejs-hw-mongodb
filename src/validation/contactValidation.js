import Joi from "joi";

export const createContactValidation = Joi.object({
    name: Joi.string().required().min(3).max(20),
    phoneNumber: Joi.string().required().min(3).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal').required(),
});

export const updateContactValidation = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
});
