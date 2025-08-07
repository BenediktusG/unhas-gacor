import Joi from "joi";

export const registerUserValidation = Joi.object({
    fullName: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required(),
});