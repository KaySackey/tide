import {action, computed, extendObservable, observable} from "mobx";
import * as React from "react";
import {ConfigurationError} from "tide/exceptions";
import {Router} from "tide/router";
import {bind_all_methods} from "tide/utils";

import {TideDispatcher} from "./dispatcher";
import {PageStateStore} from "./page_state";
import {ITideState, ITideUser, state} from "./state";
import {BasicLayout} from "./views/basic";
import {ExistingApplications, RouteList, TideSettings} from "tide/types";


export class UserApp {
    name: string | null;
    verbose_name: string;
    layout: React.ComponentType<any>;
    tide: TideApp;      // will be assigned by tide not constructor
    routes: RouteList;

    constructor() {
        this.name = this.name || this.constructor.name;
        this.verbose_name = this.verbose_name || this.constructor.name;
        this.layout = BasicLayout;
    }

    load(data: any): void {
        // this will be called by Tide *after* all apps are configured
    }
}


export class TideApp {
    basename: string;
    mode: string;
    dev_mode: boolean;
    initial_data: any;

    settings: TideSettings;

    apps: ExistingApplications;
    _router: Router;
    _view: React.Component<any, any>; // ReactComponent

    state: ITideState;

    constructor() {
        bind_all_methods(this);
    }

    /**
     * @param  {Tide} view - the top level react component
     * @param {object} props - properties given to the view
     */
    setup(view, props){
        let data = props.initial_data.tide || {};

        this.apps = {} as ExistingApplications;
        this.state = state;
        this.state.user = extendObservable(this.state.user, data.user);

        this.initial_data = data;
        this.settings = props.settings;
        this.basename = props.basename;
        this.mode = props.mode;
        this.dev_mode = props.mode === "development";

        this._view = view;

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

        return this;
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
        const app_map: Map<string, UserApp> = new Map();

        this.settings.apps.forEach((AppClass: any) => {
            let app: UserApp = new AppClass();

            if (!app.name) {
                throw new TypeError(
                    `Apps need a name as part of their configuration! Looked inside: ${JSON.stringify(app)}`)
            }

            if (app_map.has(app.name)) {
                throw new ConfigurationError(`The application named ${app.name} was listed twice.`)
            }

            app.tide = this;
            let initial = this.initial_data[app.name] || {};

            console.debug(`[Tide] Loading ${app.name} with data.... `, initial);
            app.load(initial);

            app_map.set(app.name, app);
            this.apps[app.name] = app;
        });

        // Add Routes
        this.settings.routes.forEach((route) => {
            this.add_route(route)
        });
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
     *          show(tide, {request,...params}){
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
        let app_label = route.context.app_label;

        let layout;
        if(app_label){
            let app = this.apps[app_label];
            if (!app) {
                throw new ReferenceError(`App of name ${app_label} has not been added to Tide`);
            }
            layout = app.layout;
        }else{
            layout = this.settings.default_layout;
        }


        // Transition to the next state
        page_state
            .process_transition(route, layout, view, data)
            .then((data) => {
                return this.forceUpdate();
            })
    }
}


export const tide_app : TideApp = new TideApp();