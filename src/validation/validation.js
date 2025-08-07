import { ValidationError } from "../error/validation-error.js";

const validate = (schema, request) => {
    request = request ? request : {};
    const result = schema.validate(request);
    if (result.error) {
        throw new ValidationError('invalid request body', 'VALIDATION_ERROR');
    } else {
        return result.value;
    }
};

export {
    validate,
};