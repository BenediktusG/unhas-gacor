import { ClientError } from "./client-error.js";

export class AuthorizationError extends ClientError {
    constructor(message, code) {
        super(403, message, code);
        this.name = 'AuthorizationError';
    }
}