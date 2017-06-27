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
    context: any;

    constructor(query, context) {
        super(`An error occurred on ${query.name}. ${context.error.message}`);
        this.context = context;
        this.name = "QueryError";
    }
}

export class MapperParsingException extends TideError {
    constructor() {
        super(`Could not properly serialize this object`);
    }
}