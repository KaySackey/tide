export class Route {
    // How to handle the route. It'll be up to the Dispatcher to actually take this value and do something with it
    public handler: Function;
    // Arbitrary compile-time data associated with this route. Handlers can make further use of this information.
    public context: any;
    // Name of the route. We can use this as a lookup key in the router.
    public name: string;

    // Basename to be prefixed to the route. This will be set when we join the router
    _basename: string = "";
    // Will be combined with basename to form true path
    _path: string;
    // A crossroads route instance. This will be set when we join the router
    _crossroads: any = null;

    constructor(name: string, path: string, handler: Function, context: any = {}) {
        this.name = name.trim();
        this.handler = handler;
        this._path = path;
        this.context = context;
    }

    set_basename(basename) {
        this._basename = basename || "";
    }

    get path() : string {
        return this._basename + this._path;
    }

    toString() : string {
        return `[Route] ${this.name} @ ${this.path}`;
    }
}

/**
 * Helper to create a new route
 *
 *      {string} app_label: Name of the application that this route runs under.
 *                         This can be used for debugging purposes, or within a larger framework during
 *                         rendering.  If not given, it will be null.
 *
 *      {string} name: name of the route. If not given it will be derived via this algorithm:
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
 *
 * Example:
 *
 *      route("/messages/unread/page/{page}/", controller.list_unread, "message_list_unread"),
 *
 */
export function route(path, handler, name?: string, context?: any): Route {
    let route_context;
    let derived_name;

    // Derive name if it's not given
    if (!name) {
        if (typeof handler === 'string') {
            derived_name = handler;
        }
        else if (handler instanceof Function && handler.name && !handler.isMobxAction) {
            // Special case: we can't deal with mobX actions so we ignore the functions
            derived_name = handler.name.replace(/bound/g, "").trim();
        }
        else {
            derived_name = path.replace(/[{}:]/g, "")         // remove id matches
                .replace(/[\/]/g, "_")                // replace control characters with _
                .replace(/^_/, "")                   // remove leading _
                .replace(/_+$/, "");                 // remove trailing _
        }
    }

    route_context = context || {};
    route_context.name = name || derived_name;
    route_context.app_label = route_context.app_label || null;

    return new Route(route_context.name, path, handler, route_context);
}

/**
 * Helper to include a list of routes underneath a given path
 * Returns a list of routes, annotated.
 *
 * @param  path - path to nest under (e.g. /albums/verified/ )
 * @param  routes - An array of routes
 * @param  app_label - label of the application these routes belong to. This will override any app label the routes already have.
 *
 * @throws {DispatchError} if the route cannot be validated*
 */
export function include(path: string, routes: Route[], app_label : (string|null) = null) {
    for (const route of routes) {
        route.context.app_label = route.context.app_label || app_label;
        route._path = path + route._path;
    }

    return routes;
}

/**
 * Shortcut to rendering a single React Component w/o having to write a controller function
 */
export function route_component(path: string, react_component: React.ReactNode, name?: string, context: any = {}): Route {
    let f_render = function (tide, request, params) {
        return tide.render(request, react_component, params)
    };

    return route(path, f_render, name, context)
}

export function route404(handler){
    return route("/{path*}", handler, "not_found");
}