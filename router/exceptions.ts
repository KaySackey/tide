class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name    = this.constructor.name;
        this.message = message;
        const stackTraceFunction = (Error as any).captureStackTrace;

        if ( typeof stackTraceFunction === 'function' ) {
            stackTraceFunction(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
    }
}
class TideError extends ExtendableError {
    constructor(message) {
        super(message);
    }
}

export class RouterError extends TideError {}
export class MatchNotFound extends RouterError {}
export class DispatchError extends RouterError {}