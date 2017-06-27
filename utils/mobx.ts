/**
 * Merge a bare object (obj) with a mobx object (target)
 * Preserve keys if possible
 * @param target
 * @param obj
 * @returns {*}
 * @private
 */
export function deep_merge_mobx(target, obj) {
    for (var key in obj) {
        // Escape if key isn't part local
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            continue;
        }

        var newVal = obj[key];


        if (!target[key]) {
            // The value isn't already existing
            target[key] = obj[key];
        }
        else if (Array.isArray(newVal)) {
            // Arrays
            target[key] = target[key].concat(newVal);
        }
        else if (newVal instanceof Object) {
            // Objects
            deep_merge_mobx(target[key], newVal);
        }
        else {
            // Assign boxed parameters
            target[key] = newVal;
        }
    }
    return target;
}