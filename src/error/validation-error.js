import { ClientError } from "./client-error.js";

export class ValidationError extends ClientError {
    constructor(message, code) {
        super(400, message, code);
        this.name = "VALIDATION_ERROR";
    } 
};
