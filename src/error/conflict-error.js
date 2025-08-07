import { ClientError } from "./client-error.js";

export class ConflictError extends ClientError {
    constructor(message, code) {
        super(409, message, code);
        this.name = 'ConflictError';
    }
}