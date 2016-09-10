export class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name    = this.constructor.name;
        this.message = message;
        if ( typeof Error.captureStackTrace === 'function' ) {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
    }
}
export class TideError extends ExtendableError {
    constructor(message) {
        super(message);
    }
}
export class InvalidResponse extends TideError {
    constructor(response) {
        let status  = response.statusText || response.status;
        let message = `Status: ${status} on ${response.url}`;
        super(message);
        this.response = response;
    }
}

export * from "./router/exceptions";