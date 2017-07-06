import {action, computed, extendObservable} from "mobx";
import * as React from "react";
import {ConfigurationError} from "tide/exceptions";
import {Router} from "tide/router";
import {bind_all_methods} from "tide/utils";

import {TideDispatcher} from "./dispatcher";
import {state, ITideUser, ITideState} from "./state";
import {PageStateStore} from "./page_state";

export class TideApp {
    settings: {
        routes?: any,
        apps?: any
    };

    basename: string;
    mode: string;
    dev_mode: boolean;
    initial_data: any;

    _apps: Map<string, any>;
    _router: Router;
    _view: React.Component<any, any>; // ReactComponent

    state: ITideState;

    /**
     * @param  {Tide} view - the top level react component
     * @param {object} props - properties given to the view
     */
    constructor(view, props) {
        bind_all_methods(this);

        let data = props.initial_data.tide || {};

        this.state = state;
        this.state.user = extendObservable(this.state.user, data.user);

        this.initial_data = data;
        this.settings = props.settings;
        this.basename = props.basename;
        this.mode = props.mode;
        this.dev_mode = props.mode === "development";

        this._view = view;
        this._apps = new Map();

        // Setup Router
        if (props.router) {
            this._router = props.router
        }
        else {
            let router_options = {
                basename: props.basename,
                dispatch: TideDispatcher,
                verbosity: 0
            };

            this._router = new Router(this, router_options)
        }
    }

    get page_state(): PageStateStore {
        return this.state.page;
    }

    get router(): Router {
        return this._router;
    }

    @computed
    get current_user(): ITideUser {
        return this.state.user;
    }

    @action
    start() {
        // Get data and initialize it
        console.debug("[Tide] Mounting...");
        console.debug("[Tide] Initial ", this.initial_data);

        // Setup all the apps
        this.setup_apps();

        // Set up router
        this.router.start();

        if (this.router.number_of_routes === 0) {
            throw new Error("There are no routes configured. You must at least configure one route for your app.")
        }
    }

    @action
    stop() {
        this._router.stop();
    }

    forceUpdate() {
        this._view.forceUpdate();
    }

    /**
     * Set up an application
     */
    @action
    setup_apps() {
        this.settings.apps.forEach((AppClass) => {
            const app = new AppClass();

            if (!app.name) {
                throw new TypeError(
                    `Apps need a name as part of their configuration! Looked inside: ${JSON.stringify(app)}`)
            }

            // Give the application some of its own configured data
            app.tide = this;

            app.app.store = app.store;
            app.app.tide = this;

            if (this._apps.has(app.name)) {
                throw new ConfigurationError(`The application named ${app.name} was listed twice.`)
            }

            // Set the completed app in our table
            this._apps.set(app.name, app);
        });

        // Add Routes
        this.settings.routes.forEach((route) => {
            this.add_route(route)
        });

        // Now that all the apps are in the listing
        // Let it complete them complete their initialization
        this.apps().map(app => {
            let initial = this.initial_data[app.name] || {};
            console.log(`[Tide] Initial for ${app.name}`, initial);
            app.ready(initial)
        })
    }

    add_route(route) {
        if (Array.isArray(route)) {
            route.forEach((route) => {
                this.add_route(route)
            });

            return;
        }

        this.router.set(route);
    }

    /**
     * Return an application with the given label
     * @param label
     * @returns {BasicApp}
     */
    get_app(label) {
        if (!this.has_app(label)) {
            throw new ReferenceError(`App of name ${label} has not been added to Tide`);
        }

        return this._apps.get(label);
    }

    /**
     * Returns an array of the applications installed
     * @returns {Array}
     */
    apps() {
        return Array.from(this._apps.values())
    }

    /**
     * Returns true if Tide has a registered this application
     * @param label
     * @returns {boolean}
     */
    has_app(label) {
        return this._apps.has(label)
    }


    /**
     * Set the state of the page state to pending
     * Returns true if the state was not already pending or processing
     * Returns false otherwise
     * @returns {boolean}
     */
    set_processing() {
        if (this.pending || this.processing) {
            return false;
        }
        this.page_state.set_processing();
        return true;
    }

    /**
     * Stop processing
     */
    stop_processing() {
        this.page_state.stop_processing();
    }

    /**
     * Returns true if we are waiting for a request that will change the page state
     * @returns {boolean}
     */
    @computed
    get processing() {
        return this.page_state.status === "processing"
    }

    /**
     * Returns true if we are waiting for a request that will change the page state
     * @returns {boolean}
     */
    @computed
    get pending() {
        return this.page_state.status === "pending"
    }

    /**
     * Helper function. Update the current view because of an Ajax request.
     * @param data
     */
    @action
    update_current_view(data) {
        this.page_state.update_current_view(data);
    }

    /**
     * Flash a message onto the screen. Requires processing via the user-given layout
     * @param {string} message  - content
     * @param {number} expiry - number in ms to wait before expiring this message
     */
    @action
    flash(message, expiry = 3000) {
        this.state.messages.push({
            kind: "flash",
            message: message,
            expiry: expiry
        })
    }

    /**
     * Deals with page state & user state
     *
     * The controller is a facade over Tide itself.
     *
     * In your own controllers, you'll be dispatched it as the first element of the handler.
     * E.g.
     *
     *      class MyController{
     *
     *          show(tide, request, params){
     *          // tide is TideController
     *          // request is a RouteMatch
     *          // params is an object with the matched parameters
     *          let context = {};
     *          tide.render(request, SomeView, context}
     *          }
     *      }
     *
     * A call to render will push the current view & data into the page state
     *
     * @param {RouteMatch} request
     * @param {ReactElement} view
     * @param {*|Promise} data
     */
    @action
    render(request, view, data) {
        const route = request.route;
        const page_state = this.page_state;

        // Get the app this route came from
        let app_label = route.context.app_label || "default";
        let app_conf = this.get_app(app_label);

        // Transition to the next state
        page_state
            .process_transition(route, app_conf, view, data)
            .then((data) => {
                return this.forceUpdate();
            })
    }
}