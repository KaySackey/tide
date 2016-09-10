import React from "react";
import {computed} from "mobx";
import {MobxObserver} from "tide/base/base";
import {use, bind_all_react_component_methods} from "tide/utils";
import {BasicEventHandler} from "tide/base/events";
import {path} from "tide/utils/url";

var defaultContextTypes = {
    // Tide Bubbling
    parent: React.PropTypes.object,
    // Context provided by router (e.g. react-router or others)
    router: React.PropTypes.object,

    // Application specific
    app  : React.PropTypes.object,
    store: React.PropTypes.object,
    tide : React.PropTypes.object
};

/**
 * todo: Remove. This is a legacy component only used in Orion.
 *
 * @class BaseApp
 * @extends MobxObserver
 *
 * Extend this to create an application
 *
 * Note:
 *      If you nest Apps, context.app will be the parent App.
 *      this.parent_app() will get you the same object.
 *
 *      Presenters/Views nested within will see you as context.app and have a helper method of this.app() to
 *      retrieve their parent App.
 *
 *      The difference in the terminology is to encourage Views/Presenters from considering that there is more than
 *      one App in existence. They should always have to access other App's methods via their parent.
 */
export class BaseApp extends MobxObserver {
    static contextTypes      = defaultContextTypes;
    static childContextTypes = defaultContextTypes;
    static displayName       = "Tide.BaseApp";
           context           = {};

    // Beware! Meta values are singletons!
    // We are defining them as static to indicate they should be immutable references
    // Typically; you shouldn't have anything in your constructor that changes these at runtime
    static meta = {
        store       : {state: {}},
        cache       : {},
        routes      : {},
        url_patterns: {}
    };


    constructor(props) {
        /*
         We're subclassing something so the displayName = MiddleC thanks to MobX munging.
         So lets set the displayName back to what it's supposed to be.
         */
        super(props);
        bind_all_react_component_methods(this);
        this.__proto__.constructor.displayName = this.__proto__.constructor.name;

        use(this, BasicEventHandler);

        let meta           = this.constructor.meta;
        this._store        = meta.store;
        this._cache        = meta.cache;
        this._routes       = meta.routes;
        this._url_patterns = meta.url_patterns;
    }


    // Not supported in IE8. IE8 support has been dropped from React 0.15+
    get parent() {
        return this.context.parent;
    }

    get parent_app() {
        return this.context.app;
    }

    get cache() {
        return this._cache;
    }

    get router() {
        return this.context.router;
    }

    get store() {
        return this._store;
    }

    @computed get current_user() {
        return this._store.user;
    }

    @computed get app_state() {
        return this._store.state;
    }

    @computed get ui_state() {
        return this._store.state.ui;
    }

    getChildContext() {
        return {
            parent: this,
            app   : this,
            store : this.store
        };
    }
}

