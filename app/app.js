import {action, computed} from "mobx";
import {Router} from "tide/router";
import {bind_all_methods} from "tide/utils";
import {TideDispatcher} from "./dispatcher";
import {page_state} from "./stores/page_state";
import {message_store} from "./stores/messages";
import {general_store} from "./stores/general";

/**
 * @class
 */
export class TideApp {
    /**
     * @param  {Tide} presenter - the top level react component
     * @param {object} props - properties given to the presenter
     */
    constructor(presenter, props) {
        bind_all_methods(this);

        this.presenter                  = presenter;
        this.page_state                 = page_state;
        this._general_store             = general_store;
        this._apps                      = new Map();
        this.dev_mode                   = this.mode == "development";
        this.conf                       = props.conf;
        this.mode                       = props.mode;
        this.basename                   = props.basename;
        this._applications_to_configure = props.apps;

        /**
         * @type {TideMessageStore}
         */
        this.messages = message_store;
        this.initial_data = props.initial_data.tide || {};

        // Setup Router
        if ( props.router ) {
            this._router = props.router
        }
        else {
            let router_options = {
                basename : this.basename,
                dispatch : TideDispatcher,
                verbosity: 0
            };

            this._router = new Router(this, router_options)
        }
    }

    @action start() {
        // Get data and initialize it
        console.debug("[Tide] Mounting...");
        console.debug("[Tide] Initial ", this.initial_data);

        // Setup all the apps
        this.setup_apps();

        // Set up store
        //this.page_state.refresh() // maybe needed for hot-reloading?
        this._general_store.initialize(this.initial_data);

        // Set up router
        this.router.start();

        if ( this.router.number_of_routes === 0 ) {
            throw new Error("There are no routes configured. You must at least configure one route for your app.")
        }
    }

    @action stop() {
        this._router.stop();
    }

    forceUpdate() {
        this.presenter.forceUpdate();
    }

    /**
     * Set up an application
     * @param {Array.<BasicConf>} apps
     */
    @action setup_apps(apps) {
        this._applications_to_configure.forEach((app_conf) => {
            if ( !app_conf.name ) {
                throw new TypeError(`Apps need a name as part of their configuration! Looked inside: ${JSON.stringify(app_conf)}`)
            }

            // Parse its routes into our router
            // TideStore (.. which is badly named... its technically just a rendering engine).
            // will end up using the context to determine which layout to use during a render
            for (let route of app_conf.routes) {
                route.context.app_label = app_conf.name;
                this.router.set(route);
            }

            // Give the application some of its own configured data
            app_conf.app.store = app_conf.store;
            app_conf.app.tide  = this;

            // Set the completed app in our table
            this._apps.set(app_conf.name, app_conf);
        });

        // Now that all the apps are in the listing
        // Let it complete them complete their initialization
        this.apps().map(app_conf => {
            let initial = this.initial_data[app_conf.name] || {};
            console.log(`[Tide] Initial for ${app_conf.name}`, initial);
            app_conf.ready(initial)
        })
    }

    /**
     * Return an application with the given label
     * @param label
     * @returns {BasicApp}
     */
    get_app(label) {
        if ( !this.has_app(label) ) {
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

    /*** Context ***/

    /**
     * Return the current router instance
     * @returns {Router}
     */
    get router() {
        return this._router;
    }

    /**
     * Return the current user
     * @returns {User}
     */
    @computed get current_user() {
        return this._general_store.user;
    }

    /**
     * Set the state of the page state to pending
     * Returns true if the state was already pending or processing
     * Returns false otherwise
     * @returns {boolean}
     */
    set_processing() {
        if ( this.pending || this.processing ) {
            return false;
        }
        this.page_state.set_processing();
        return true;
    }

    /**
     * Set the current page state to pending.
     * todo: Depracate? Do we need this? We do need a method to transition to a whole new page w/ data we already
     * have. but it doesn't have to be manual. Maybe a transition_to(route, view, data)
     */
    set_pending() {
        this.page_state.set_pending();
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
    @computed get processing() {
        return this.page_state.status == "processing"
    }

    /**
     * Returns true if we are waiting for a request that will change the page state
     * @returns {boolean}
     */
    @computed get pending() {
        return this.page_state.status == "pending"
    }

    /**
     * Helper function. Update the current view because of an Ajax request.
     * @param data
     */
    @action update_current_view(data) {
        this.page_state.update_current_view(data);
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
     * @param {XML|ReactElement} view
     * @param {*|Promise} data
     */
    @action render(request, view, data) {
        const route = request.route;
        const page_state = this.page_state;

        // Get the app this route came from
        let app_label = route.context.app_label;
        let app_conf  = this.get_app(app_label);
        
        // Transition to the next state
        page_state
          .process_transition(route, app_conf, view, data)
          .then((data) => {
              return this.forceUpdate();
          })
    }
}