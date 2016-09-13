import React from "react";
import DevTools from "mobx-react-devtools";
import {computed} from "mobx";
import {InternalError, NotFound} from "./errors";
import {Wrapper} from "tide/base/context";
import {MobxObserver} from "tide/base/base";

/**
 * @class
 */
export class TidePage extends MobxObserver {
    static displayName = "Tide.Page";

    get page_state() {
        return this.props.tide.page_state;
    }

    get tide() {
        return this.props.tide;
    }

    /**
     * Compile the data into the current view.
     * It is safe to call at all stages of the render, because it will always return some kind of React.Component
     * even if its just a div to tell us that the page is loading.
     * @returns {ReactElement|XML}
     */
    @computed get current_view() {
        const page_state = this.page_state;

        let view       = page_state.view;
        let data       = page_state.data;
        let status     = page_state.status;
        let route_name = page_state.route_name;
        let last_update = page_state.last_update;

        console.log(`[Tide] Current View: ${route_name} - ${status}. Updated @ ${last_update}`);

        if ( !status ) {
            return <div>[Tide] Waiting to initialize data store.</div>
        }
        if ( !route_name ) {
            return <div>[Tide] No route set.</div>
        }

        if ( status === 'pending' ) {
            return <div>[Tide] Loading page ... status: {status}</div>
        }

        if(status === 'failed'){
            return <div>[Tide] Attempting to load this page failed.</div>
        }

        // Status at this point should be processing / ok / failed
        return this._create_view(view, data, []);
    }

    /**
     * Ensure that we create a view with a React Element.
     * @private
     * @param {XML|React.Component|React.Element|ReactElement} view
     * @param {*} props
     * @param {Array.<ReactElement>} children
     * @returns {ReactElement}
     */
    _create_view(view, props, children) {
        if ( React.isValidElement(view) ) {
            return React.cloneElement(view, props, children);
        }

        return React.createElement(view, props, children);
    }

    render() {
        // Page State, includes current view
        const page_state = this.page_state;

        let route_name = page_state.route_name;
        let app_label  = page_state.app_label;
        let status     = page_state.status;
        let view       = this.current_view;

        if(!route_name || !this.tide.has_app(app_label)){
            return <InternalError />
        }

        // Get Application Configuration for current view
        // We'll put store/app in a wrapper at the end so the context
        // is populated down to the View/Presenters that our render has returned
        let app_conf = this.tide.get_app(app_label);

        let app    = app_conf.app;
        let store  = app_conf.store;
        let layout = app_conf.layout;

        console.log(`[Tide] Rendering... ${route_name} in app: ${app_label}. Status: ${status}`);

        let children = <div>
            {view || <InternalError />}
            {this.tide.dev_mode ? <DevTools /> : ""}
        </div>;

        let layout_component = this._create_view(layout, {}, [children]);

        return <Wrapper app={app} store={store}>{layout_component}</Wrapper>;
    }
}