import { ClientError } from "./client-error.js";

export class BadRequestError extends ClientError {
    constructor(message, code) {
        super(400, message, code);
        this.name = 'BadRequestError';
    }
};