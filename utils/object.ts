
interface ExtendedPropertyDescriptor extends PropertyDescriptor{
    meta: {
        name: string,
        is_computed: boolean,
        is_method: boolean
    }
}


/**
 * Return all the non-constructor property descriptors of an object, including the inheritance chain
 * @param obj
 * @returns {Array}
 */
function get_all_properties(obj) {

    let names       : string[] = [];
    let descriptors : ExtendedPropertyDescriptor[] = [];
    let curr        : any = obj;

    do {
        let new_names : string[] =
              Object.getOwnPropertyNames(curr)
                .filter((name) => names.includes(name) === false);

        let new_descriptors = new_names.map(name => {
            // Annotate useful meta data on the descriptor
            let descriptor  = Object.getOwnPropertyDescriptor(curr, name) as ExtendedPropertyDescriptor;
            let is_computed = descriptor.get !== undefined || descriptor.set !== undefined;
            let is_method   = descriptor.value instanceof Function && !is_computed;

            descriptor.meta = {
                name       : name,
                is_computed: is_computed,
                is_method  : is_method
            };

            return descriptor;
        });

        names       = names.concat(new_names);
        descriptors = descriptors.concat(new_descriptors);
    } while (curr = Object.getPrototypeOf(curr));

    return descriptors
}

/**
 * Bind all the methods of a given object, including inherited ones
 * @param obj
 * @param options
 *     exclusions: array method names not to bind. Default is ['constructor']
 */
export function bind_all_methods(obj, options = {exclusions: ['constructor']}) {
    const exclusions = options.exclusions;

    get_all_properties(obj)
      .filter((prop) => exclusions.includes(prop.meta.name) === false)
      .filter((prop) => prop.meta.is_method)
      .forEach((prop) => {
          obj[prop.meta.name] = prop.value.bind(obj);
      })
}


/**
 * Bind all the methods defined for an object that inherits from React.Component
 * @param obj
 */
export function bind_all_react_component_methods(obj) {
    bind_all_methods(obj, {
        exclusions: [
            "constructor", "render", "getChildContext", "componentWillMount", "componentDidMount", "shouldComponentUpdate",
            "componentDidUpdate", "componentWillUnmount", "setState", "forceUpdate", "replaceState", "isMounted", "setProps",
            "replaceProps", "getDOMNode"
        ]
    })
}


// Check if object, string, or collection is empty
export function is_empty(obj) {
    if ( typeof obj === "string" ) {
        return obj === "";
    }

    if ( Array.isArray(obj) ) {
        return obj.length === 0;
    }

    if ( typeof obj === 'object' || typeof obj === 'function' ) {
        for (let i in obj) {
            if ( obj.hasOwnProperty(i) ) {
                return false;
            }
        }
        return true;
    }

    throw new Error("Expected a string, object, function, or array. But instead received a " + (typeof obj))
}
