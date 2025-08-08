import Joi from "joi";

export const spinValidation = Joi.object({
    betAmount: Joi.number().min(1).required(),
});