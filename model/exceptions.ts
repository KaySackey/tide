import {ExtendableError} from "exceptions";

export class QueryNotFound extends ExtendableError {
    constructor(name) {
        super(`Query named ${name} was not found.`);
    }
}

export class InvalidQuery extends ExtendableError {
    constructor(name) {
        super(`Query named ${name} was not found.`);
    }
}

export class QueryError extends ExtendableError {
    context: any;

    constructor(query, context) {
        super(`An error occurred on ${query.name}. ${context.error.message}`);
        this.context = context;
        this.name = "QueryError";
    }
}

export class MapperParsingException extends ExtendableError {
    constructor() {
        super(`Could not properly serialize this object`);
    }
}