import {serializable, list, object, createSimpleSchema, identifier} from "serializr";
import {observable, computed} from "mobx";

export function simple(properties) {
    return createSimpleSchema(properties)
}

export function list_of(ObjectClass) {
    return list(object(ObjectClass));
}