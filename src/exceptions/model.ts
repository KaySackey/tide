import {TideError} from "./base";

export class QueryNotFound extends TideError {
    constructor(name) {
        super(`Query named ${name} was not found.`);
    }
}

export class InvalidQuery extends TideError {
    constructor(name) {
        super(`Query named ${name} was not found.`);
    }
}

export class QueryError extends TideError {
    responseData: any;
    _wrapped: Error;

    constructor(query, original_error, responseData) {
        super(`An error occurred on ${query.name}. ${original_error.message}`);

        this._wrapped = original_error;
        this.responseData = responseData;

        this.name = "QueryError";
    }
}

export class MapperParsingException extends TideError {
    constructor() {
        super(`Could not properly serialize this object`);
    }
}