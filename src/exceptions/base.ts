export class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name    = this.constructor.name;
        this.message = message;
        const captureStackTrace = (Error as any).captureStackTrace;

        if ( typeof captureStackTrace === 'function' ) {
            captureStackTrace(this, this.constructor);
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

export class ConfigurationError extends TideError { }