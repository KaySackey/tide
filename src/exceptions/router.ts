import {TideError} from "./base";

export class RouterError extends TideError {}
export class MatchNotFound extends RouterError {}
export class DispatchError extends RouterError {}