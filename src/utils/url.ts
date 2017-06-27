/**
 * Return a url to the endpoint
 *
 *  Usage:
 *
 *     > path("/hello/:id", [1])
 *     > "/hello/:id"
 *
 *     > path("/hello/:id", {id: 1}
 *     > "/hello/id"
 *
 *     > path("/hello/:id", {nope: 1})
 *     > ! ReferenceError Invalid Pattern\n Cannot find match :id for /"hello/:id".\n Given parameters: {nope: 1}
 *
 * @param {string} pattern
 * @param {Array|object|Map|Set} params
 * @returns {string}
 */
export function path(pattern, params) {
    const replace_parameter = (func) => pattern.replace(/(:\w+)/ig, func);
    const throw_on_unmatched = (match, value) => {
        if (value === undefined){
            let err_message = `Invalid Pattern Cannot find match ${match} for "${pattern}". Given parameters: ${JSON.stringify(params)}`;
            throw ReferenceError(err_message);
        }
    };

    if(Array.isArray(params)){
        let i        = 0;
        return replace_parameter((match) => {
            let value = params[i];
            throw_on_unmatched(match, value);
            i++;
            return value;
        });
    }

    return replace_parameter((match) => {
        let value = params[match.slice(1)];
        throw_on_unmatched(match, value);
        return value;
    });
}