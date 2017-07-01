import {DispatchError, RouterError} from "tide/exceptions";
import {default as crossroads} from "crossroads";
import {History as RouterHistory} from "history/index";
import {default as createMemoryHistory} from "history/createMemoryHistory";
import {default as createBrowserHistory} from "history/createBrowserHistory";
import {Route} from "./route";
import {CrossRoadObject} from "@types/crossroads";

type ActionTypes = ("push" | "replace" | null);

export class Location {
    pathname: string;
    search: string;

    constructor(pathname, search) {
        this.pathname = pathname;
        this.search   = search;
    }

    serialize() {
        return this.pathname + this.search;
    }

    toString(){
        return `[Location] ${this.pathname + this.search}`;
    }
}

enum Verbosity{
    ERROR, WARN, INFO, DEBUG, LOG
}


export class RouteMatch {
    /**
     * Exports all the details about a route match so the controllers can deal with it.
     */

    route: Route;
    params: any;
    location: string;

    constructor(route, params, location) {
        this.route = route;
        this.params = params;
        this.location = location;
    }

    toString(){
        return `[Matched Route] ${this.route.name} @ ${this.location}`;
    }
}


export interface DispatcherConstructor{
    new(controller : any) : Dispatcher;
}

export interface Dispatcher {
    /**
     *
     * Validate that we can dispatch upon this route
     * Required to fulfill the interface of a dispatcher.
     *
     * @param route
     * @throws {DispatchError} if the route cannot be validated
     */
    validate(route: Route) : void;

    /**
     * Call the dispatch function.
     *
     * Required to fulfill the interface of a dispatcher.
     *
     * @param {RouteMatch} matched_route
     *
     * All of the above will be given to the dispatched function which must have a signature of
     *
     *      handler(Object: params, RouteMatch: route_match)
     *
     * @throws DispatchError if there is any trouble handling the dispatch
     */
    dispatch(matched_route: RouteMatch) : any
}

export class BasicDispatcher implements Dispatcher{
    controller: any;

    constructor(controller : any) {
        this.controller = controller;
    }

    validate(route: Route) {

        let handler = route.handler;
        let name = route.name.trim();

        if ( !(typeof handler === 'string' || handler instanceof Function) ) {
            throw new DispatchError(
              `Dispatch expects the handler to be a string or function. It was ${JSON.stringify(handler)}`)
        }

        if (typeof name !== 'string') {
            throw new DispatchError(
              `Dispatch expects the name be a string. It was ${JSON.stringify(name)}`)
        }else if (name.includes("/")){
            throw new DispatchError(
              `Dispatch expects route name to not include forward slashes. It was ${JSON.stringify(name)}`)
        }
    }

    dispatch(matched_route: RouteMatch) {

        let route = matched_route.route;
        let params = matched_route.params;
        let handler = route.handler;

        if ( typeof handler === 'string' ) {
            this._dispatch_on_string(matched_route)
        }
        else if ( handler instanceof Function ) {
            handler.call(null, params, matched_route)
        }

        throw new DispatchError(
          `Dispatch expects the handler to be a string or function. It was ${JSON.stringify(handler)}`)
    }

    _dispatch_on_string(matched_route: RouteMatch) {
        // Deprecated
        // todo: remove

        // Default dispatching is to call the action on a given controller
        let controller       = this.controller;
        let route            = matched_route.route;
        let params           = matched_route.params;
        let handler_name     = route.handler.name.trim();
        let handler_function = controller[handler_name];

        // This is a regular object so we try to call .process() on it
        if ( controller[handler_name] === undefined ) {
            throw new DispatchError(
              `Could not find a property named ${handler_name} on the controller ${controller.constructor.name}`);
        }
        else if ( !(handler_function instanceof Function) ) {
            throw new DispatchError(
              `Could not find a method named ${handler_name} on the controller ${controller.constructor.name}.` +
              `The property found was of type ${handler_function.name}`)
        }

        // Call the handler function
        handler_function.call(null, params, matched_route);
    }
}

export class Router {
    /**
     *
     * At its core the Router is a facade over Crossroads and History
     *
     * History listens to changes to the URL, so if the user manually edits the URL its caught then propagated to the
     * router first to see if a match can be found. When Crossroads dispatches on a route,
     * it'll tell History to update the browser URL or hash.
     *
     * Basic Usage.
     *
     * Initialize the router by passing it your controller, dispatch class and history.
     *
     * Default Dispatch class
     * -----
     * The default dispatch class is BasicDispatch
     * if you define your route with a string as the handler...
     *
     *      route("/welcome/", "show_welcome")
     *
     * Then it will call the corresponding method on the controller that you hav given.
     *
     * If the dispatcher is given as a function...
     *
     *      route("/welcome/", _ => console.log("Hi!")
     *
     * Then the dispatcher will call the function directly.
     *
     * In all cases, it will call the function with two parameters.
     * The first parameter is the list of matched parameters in the route.
     *      e.g.
     *           Given a route defined as:
     *              route("/hello/{name}/", "say_hello")
     *           On a match for the url:
     *              "/hello/Katie/"
     *           This will result in the say_hello method on your controller being called
     *           with the first parameter of {hello: "Katie"}
     *
     *  The second parameter is a RouteMatch object consisting of
     *      - route: the route that was matched { name, path, handler }
     *      - location: the location that was matched if given { pathname, search }
     *      - params: the parameters matched on this route
     *
     * If the dispatcher was a function. It will call the function directly.
     *
     * Default History
     * ----
     * If no history object is given. The default history one will be browser history.
     *
     *           import { createHistory } from 'history'
     *           const history = createHistory()
     *
     *
     * Normal Dispatch
     *
     *      This will push the current URL into history, and cause a dispatch to be sent.
     *      This is what Link does internally when it creates its anchors.
     *
     *      router.go(url)
     *
     * Internal Redirects
     *
     *      This will overwrite the current URL and not leave a record in the browser history.
     *
     *      router.redirect(name, params)
     *
     * External Redirects
     *
     *       Not supported. In the browser, use window.location to move to a URL without the router.
     *
     */

    controller: any;
    _history: RouterHistory;

    verbosity: Verbosity = Verbosity.ERROR;
    _initialized: boolean = false;
    _routes: Map<string, Route> = new Map();
    _current: (RouteMatch | null) = null;
    _history_disposer: (null|Function) = null;
    _basename: (string | undefined);
    dispatch_on_start: boolean = true;
    crossroads: CrossRoadObject;
    dispatcher: any;

    options: {
        dispatch: 'basic' | DispatcherConstructor,
        history: 'guess' | RouterHistory,
        verbosity: Verbosity,
        dispatch_on_start: true,
        basename: ""
    };

    constructor(controller, passed_options) {
        let default_options = {
            dispatch: 'basic',
            history: 'guess',
            verbosity: 0,
            dispatch_on_start: true,
            basename: ""
        };

        let options = Object.assign(default_options, passed_options);

        this.controller        = controller;
        this._basename         = options.basename;
        this.verbosity         = options.verbosity;
        this.dispatch_on_start = options.dispatch_on_start;

        this.crossroads             = crossroads.create();
        this.crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

        // Debugging
        //this.crossroads.routed.add(console.log, console);
        //this.crossroads.bypassed.add(console.log, console);
        //this.crossroads.switched.add(console.log, console);
        // Create Dispatcher
        switch(options.dispatch){
            case 'basic':
                this.dispatcher = new BasicDispatcher(controller);
                break;
            default:
                this.dispatcher = new options.dispatch(controller);
        }

        // Create History
        if(options.history === 'guess'){
            options.history = this._has_document_model ? 'browser' : 'server';
        }
        switch(options.history){
            case 'browser':
                this._history = createBrowserHistory();
                break;
            case 'server':
                this._history = createMemoryHistory();
                break;
            default:
                throw Error(`History string was ${options.history}. Valid options are browser or server.`)
        }
    }

    /**
     * Creates a route
     * @param {string} path
     * @param {string|Function} handler
     * @param {*} options
     * @return {Router}
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
     * @throws {DispatchError} if the route cannot be validated
     */
    route(path, handler, options : any = {}) {
        let name = options.name;

        if(!name){
            if(typeof handler === 'string'){
                name = handler;
            }
            else if(handler instanceof Function && handler.name){
                name = handler.name.replace(/bound/g, "").trim();
            }
            else{
                name = path.replace(/[{}\/]/g, "").replace("-", "-");
            }
        }

        let route = new Route(name, path, handler);
        this.set(route);

        // Let us chain route calls
        return this;
    }


    /**
     * Set a route in the handler.
     */
    set(route : Route){
        if(this._initialized){
            throw new RouterError(`You cannot add routes after initialization`);
        }

        this.dispatcher.validate(route);
        this._routes.set(route.name, route);
    }

    /**
     * Get a route from the directory
     * @param {string} name
     * @throws RouterError if the route doesn't exist
     * @returns {Route}
     */
    get(name) : Route {
        if ( !this._routes.has(name) ) {
            throw new RouterError(`Route of >> ${name} << does not exist.`);
        }

        return this._routes.get(name) as Route;
    }


    /**
     * @returns {RouteMatch|null} the currently matched & active route
     */
    get current() : RouteMatch {
        return this._current;
    }

    /**
     * Return a history object.
     * See here: https://github.com/mjackson/history/blob/master/docs/Glossary.md#history
     */
    get history() : RouterHistory {
        return this._history;
    }

    /**
     * Return all the routes declared thus far as an array.
     */
    get routes() : Route[] {
        return Array.from(this._routes.values());
    }

    /**
     * Get the number of routes in the crossroads instance
     */
    get number_of_routes() : number{
        return this.crossroads.getNumRoutes();
    }

    /**
     * Start the router
     *
     * Usage (e.g. server side routing)
     *
     *      router.start(path)
     *
     * Alternatively, you can setup a custom history which defines location for server side use.
     *
     * In the browser. You will have typically setup a history object.
     * The default is browserHistory.
     *
     * In this case, it will automatically pick up the current pathname+search from the history object
     * Since the history object abstracts away the usage of hashes vs HTML5 path state, this is a safe option.
     *
     * Todo: rewrite above for History 4.0.0 which uses location instead of getCurrentLocation
     *
     * @param {string} [start_url] - optional location to begin operating upon
     */
    start(start_url? : string) {
        this._log(3, "Starting...");
        let location;

        this._initialize();

        // Get the current location from our history object
        // Default MemoryHistory doesn't have a getCurrentLocation so you'd need to pass url directly
        let url = start_url;
        if (!start_url && (this.history && this.history.location)) {
            location = this.history.location;
            url = location.pathname + location.search;
        }

        if( this.dispatch_on_start && typeof url === 'string') {
            this.go(url, 'replace');

        }

        // Start listening to PopState or HashChange events
        this._history_disposer = this.history.listen((history_location, action) => {
            if(action === "POP"){
                // Go to route, don't update history anymore
                this.go(history_location.pathname+history_location.search, null)
            }

            this._log(3, `History Listen [${action}]: Got location`, history_location);
        });
    }

    stop() {
        this._log(3, `Stopped...`);
        if(!this._initialized)
            return;

        // Remove all routes. We'll need to re-init later.
        this.crossroads.removeAllRoutes();

        if ( this._history_disposer ) {
            this._history_disposer();
        }

        this._initialized = false;
    }


    /**
     * Reset the state of the router, so calling go() will result in a dispatch again.
     * Generally this isn't needed, except for testing & hot-reloading.
     */
    reset(){
        this.crossroads.resetState();
    }

    /**
     * Go to a given URL
     * @param url
     * @param {string|null} action - Determines what to do with history.
     *      One of 'push' or 'replace'. If null, then the history will not be updated.
     */
    go(url : string, action : ActionTypes = 'push') {
        // Throw error if we are uninitialized
        this._must_be_initialized();

        this._log(3, `Go: ${url}`);

        // Final parameter will be sent as first parameter of the matched routes internal handler
        // e.g. this is why we can do addRoute(path, (location, params) => .... )
        this.crossroads.parse(url, [action, this._location_from_url(url)]);
    }

    /**
     * Refresh the current page
     */
    refresh(){
        this.dispatcher.dispatch(this._current);
    }

    /**
     * Dispatch on a given route.
     * @param {Route} route
     * @param {*} params
     * @param {Location} location
     * @throws DispatchError if there was an error dispatching the route.
     */
    dispatch(route : Route, params : any, location : Location) {
        this._log(2, `Dispatching ${route.name} to >> `, route.handler);
        this._current = new RouteMatch(route, params, location);
        this.dispatcher.dispatch(this._current);
    }

    /**
     * Return the path generated from this route
     * @param name
     * @param params
     * @throws RouterError if the route isn't found
     * @throws Error if a parameter for creating the route isn't given
     * @returns {string}
     */
    path(name: string, params: any = {}) {
        // Throw error if we are uninitialized
        this._must_be_initialized();

        let route = this.get(name);
        return route._crossroads.interpolate(params);
    }

    /**
     * Will move to a new location w/ a given set of params
     * Will leave a record in the browser history.
     *
     * @throws RouterError if the route isn't found
     */
    go_to(name: string, params: any = {}) {
        // Throw error if we are uninitialized
        this._must_be_initialized();

        let route = this.get(name);

        // Update the Browsers location
        // url includes query strings if they were defined as part of the route
        let url      = route._crossroads.interpolate(params);
        this.go(url)
    }

    /**
     * Will move to a new location w/ a given set of params
     * Will not leave a record in the browser history.
     *
     * @throws RouterError if the route isn't found
     */
    redirect(name: string, params: any = {}) {
        // Throw error if we are uninitialized
        this._must_be_initialized();

        let route = this.get(name);

        // Update the Browsers location
        // url includes query strings if they were defined as part of the route
        let url      = route._crossroads.interpolate(params);
        let location = this._location_from_url(url);
        this.history.replace(location);

        // Dispatch on the route as if we got to it originally
        this.dispatch(route, params, location);
    }

    /**
     * Update the path, leaving a record of previous URL
     * Will not dispatch a route.
     *
     * This can be used if you have a complicated component like a virtual-grid or infinite scrolling section, and
     * want to have the URL change at specific way points but want to handle gathering data and rendering w/o a full
     * dispatch & re-render being sent out.
     *
     * @throws RouterError if the route isn't found
     */
    update(name: string, params: any = {}){
        // Throw error if we are uninitialized
        this._must_be_initialized();

        let route = this.get(name);

        // Update the Browsers location
        // url includes query strings if they were defined as part of the route
        let url      = route._crossroads.interpolate(params);
        let location = this._location_from_url(url);
        this.history.push(location);
    }


    /**
     * Return a location object from a URL
     *
     *  > this._location_from_url("/hello/?world=2")
     *  > { pathname: "/hello/", search: "?world=2" }
     *
     * @param url
     * @returns {Location}
     */
    protected _location_from_url(url : string) {
        let pathname = url;
        let search   = "";

        let temp = url.split("?");

        if ( temp.length === 2 ) {
            // url part is everything before the ?
            pathname = temp[0];
            // We do not want to keep empty search strings
            // but if its non-empty we append the ? back onto the string.
            search = temp[1].trim();
            if ( search ) {
                search = "?" + search;
            }
        }

        return new Location(pathname, search);
    }

    /**
     * @throws RouterError if router is not initialized
     */
    protected _must_be_initialized(){
        if(!this._initialized){
            throw new RouterError(`Router is not initialized. Please run router.start() after adding routes.`);
        }
    }

    /**
     * Returns true if we have a valid BrowserDOM
     */
    protected get _has_document_model() : boolean{
        return typeof window !== 'undefined'
                && window.document !== undefined
                && window.document.documentElement !== undefined;
    }


    /**
     * Initialize router by parsing defined routes/scopes/redirects.
     * Then we create route matches for them in crossroads.
     * @private
     */
    protected _initialize() {
        if ( this._initialized ) {
            return;
        }

        this._log(2, `Initializing Routes...`);

        //Add routing information to crossroads
        // todo: handle internal only routes
        // An internal only route can be used to keep track of UI state
        // But it will never update the URL
        // You can't use .go() to get to an internal route
        // You can only get it via directly calling dispatch(route, params)
        //
        let routes = this.routes;

        for (let route of routes) {
            this._log(3, `Initializing >> ${route.name}`);

            // Set basename
            route.set_basename(this._basename);
            // Set crossroads_route
            route._crossroads = this.crossroads.addRoute(route.path, this._make_crossroads_shim(route));
        }

        this._log(3, `Initialized ${routes.length} routes`);
        this._initialized = true;
    }

    /**
     * Crossroads thinks its supposed to dispatch; but we want to take over that.
     * So we create a function here that'll just callback into us with enough information
     * to make a proper dispatch
     */
    protected _make_crossroads_shim(route){
        return (action : ActionTypes, location : Location, params : any) => {
                    if(action === 'push'){
                        this.history.push(location);
                    }else if(action === 'replace'){
                        this.history.replace(location);
                    }

                    this.dispatch(route, params, location);
                };
    }

    /**
     * @protected: Log's data given a verbosity setting
     * @param verbosity {number} : verbosity setting of message
     * @param {string} messages
     */
    protected _log(verbosity : number, ...messages) {
        if ( this.verbosity >= verbosity ) {
            let logger;
            switch(verbosity){
                case 0:
                    logger = console.error || console.log;
                    break;
                case 1:
                    logger = console.warn || console.log;
                    break;
                case 2:
                    logger = console.info || console.log;
                    break;
                case 3:
                    logger = console.debug || console.log;
                    break;
                default:
                    logger = console.log;
                    break;
            }

            logger(`[Router] `, ...messages);
        }
    }
}