import {createSimpleSchema, custom, list, object, PropSchema} from "serializr";

export function simple(properties) {
    return createSimpleSchema(properties)
}

export function list_of(ObjectClass) {
    return list(object(ObjectClass));
}


/*** Found at https://github.com/mobxjs/serializr/issues/50 ***/


/**
 * Prop schema for JSON serializable values.
 * @param restrictionChecker function to check for possible restrictions.
 * @return {PropSchema}
 */
export const jsonValue = (restrictionChecker?: (value: any) => string | undefined): PropSchema => {
    const convert = (v: any, errorMessage: string) => {
        if (restrictionChecker) {
            const err = restrictionChecker(v);
            if (err !== undefined && err !== null) {
                throw new Error(errorMessage + err);
            }
        }
        return v;
    };

    const modelToJson = (v: any) => {
        return convert(v, 'serialization error: ');
    };

    const jsonToModel = (v: any) => {
        return convert(v, 'deserialization error: ');
    };

    return custom(modelToJson, jsonToModel);
};

/**
 * Prop schema for non-null JSON-serializable objects.
 * @param restrictionChecker function to check for possible restrictions.
 * @return {PropSchema}
 */
export const jsonObject = (restrictionChecker?: (value: any) => string | undefined): PropSchema => {
    const composedRestrictionChecker = (value: any) => {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return 'not an object';
        }

        if (restrictionChecker) return restrictionChecker(value);
        return undefined;
    };

    return jsonValue(composedRestrictionChecker);
};
