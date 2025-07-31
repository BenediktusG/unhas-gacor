import { ClientError } from "./client-error.js";

export class AuthenticationError extends ClientError {
    constructor(message, code) {
        super(401, message, code);
        this.name = 'AuthenticationError';
    }
};