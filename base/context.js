import React, {PropTypes} from "react";
import {computed} from "mobx";
import {MobxObserver} from "tide/base/base";
import {use, bind_all_react_component_methods} from "tide/utils";
import {BasicEventHandler} from "tide/base/events";

export const defaultContextTypes = {
    // Tide Bubbling
    parent: PropTypes.object,

    // Application specific
    router: PropTypes.object,
    app   : PropTypes.object,
    store : PropTypes.object,
    tide  : PropTypes.object
};

/**
 * Used by the TidePresenter to create a context for a displaying the current view in.
 * @class
 */
export class Wrapper extends MobxObserver{
    static childContextTypes = defaultContextTypes;
    static displayName = "Tide.Wrapper";

    static propTypes = {
        app   : PropTypes.object.isRequired,
        store : PropTypes.object.isRequired,
        children: PropTypes.node.isRequired
    };

    getChildContext() {
        return {
            app: this.props.app,
            store: this.props.store,
            parent: this.props.app
        };
    }

    render(){
        return <div>{this.props.children}</div>
    }
}

/**
 * @class
 */
export class RenderingContext extends MobxObserver {
    static contextTypes      = defaultContextTypes;
    static childContextTypes = defaultContextTypes;
    static displayName       = "Tide.RenderingContext";

    constructor(props) {
        super(props);
        bind_all_react_component_methods(this);
        // Debugging note:
        // The display name will always be Tide.RenderingContext until the component has been constructed.
        // This complicates debugging because if you throw an error before at least one instance of your class has
        // been created then it will be called Tide.View
        // To work around this define static displayName on your inheriting classes.
        this.constructor.displayName = this.__proto__.constructor.name;
        use(this, BasicEventHandler);
    }

    /**
     * @returns {Tide}
     */
    get tide() {
        return this.context.tide;
    }

    get parent() {
        return this.context.parent;
    }

    /**
     * @returns {*|BaseApp}
     */
    get app() {
        if(!this.context.app){
            throw Error(`Not running within an applications context`);
        }

        return this.context.app;
    }

    /**
     * @returns {*|BaseStore}
     */
    get store() {
        return this.context.store;
    }

    /**
     * @returns {*|User}
     */
    @computed get current_user() {
        return this.tide.current_user;
    }

    @computed get app_state() {
        return this.store.state;
    }

    @computed get ui_state() {
        return this.store.state.ui;
    }
}
