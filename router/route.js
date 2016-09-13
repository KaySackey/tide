/**
  * @class Route
  */
export class Route {
    /**
     * @param {string} name
     * @param {string} path
     * @param {string|Function} handler
     * @param {*} context
     */
    constructor(name, path, handler, context = {}) {
        /**
         * Name of the route. We can use this as a lookup key in the router.
         * @type {string}
         */
        this.name    = name.trim();

        /**
         * How to handle the route. It'll be up to the Dispatcher to actually take this value and do something with it
         *
         * @property handler
         * @type {string|function}
         */
        if(typeof handler == 'string'){
            this.handler = handler.trim();
        }else {
            this.handler = handler;
        }

        /**
         * A crossroads route instance
         * This will be set when we join the router
         * @private
         */
        this._crossroads = null;

        /**
         * WIll be combined with basename to form true path
         * @type {string}
         * @private
         */
        this._path   = path;


        /**
         * This will be set when we join the router
         * @type {string}
         * @private
         */
        this._basename = "";

        this.context = context;
    }

    set_basename(basename){
        this._basename = basename || "";
    }

    /**
     * Return the path
     * @returns {string}
     */
    get path(){
        return this._basename + this._path;
    }

    toString(){
        return `[Route] ${this.name} @ ${this.path}`;
    }
}

/**
* Helper to create a new route
*
* @returns {Route}
* @param {string} path
* @param {string|Function} handler
* @param {*} options
*      name: name of the route. If not given it will be derived via this algorithm:
*
*          1. If handler is a string we use it as the name
*          2. If handler is a unbound named function, we use its name
*          3. If handler is a bound named function we use its name, replacing declarations of "bound " with ""
*          3. If handler is a anonymous function, we use the path removing braces and forward slashes
*             & replacing dashes with underscores
*
*                  E.g. /hello/{id}/  => becomes a name of "hello_id"
*
* @throws {DispatchError} if the route cannot be validated*
*/
export function route(path, handler, options = {}) {
    let name;
    if(typeof options === 'string'){
        name = options;
    }
    else{
        name = options.name;
    }

   if(!name){
       if(typeof handler == 'string'){
           name = handler;
       }
       else if(handler instanceof Function && handler.name && !handler.isMobxAction){
           // Special case: we can't deal with mobX actions so we ignore the functions
           name = handler.name.replace(/bound/g, "").trim();
       }
       else{
           name = path.replace(/[{}:]/g, "")         // remove id matches
                      .replace(/[\/]/g, "_")      // replace control characters with _
                      .replace(/^_/, "")           // remove leading _
                      .replace(/_+$/, "");          // remove trailing _
       }
   }

   return new Route(name, path, handler);
}

/**
 * Shortcut to rendering a single React Component w/o having to write a controller function
 * @param path
 * @param react_component
 * @param options
 * @returns {Route}
 */
export function route_react(path, react_component, options={}){
    let f_render = function(tide, request, params) {
        tide.render(request, react_component, params)
    };

    return route(path, f_render, options)
}