//import DevTools from "mobx-react-devtools";
import {computed} from "mobx";
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import * as React from "react";
import {InternalError} from "./errors";



@observer
export class TideWrapper extends React.Component<any, any> {
    /**
     * Used by the TidePage to create a context for a displaying the current view in.
     */

    static childContextTypes = {
        app: PropTypes.object,
        store: PropTypes.object
    };

    static displayName = "Tide.Wrapper";

    static propTypes = {
        app: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        layout_component: PropTypes.node.isRequired
    };

    props: {
        app: any,
        store: any,
        layout_component: any
    };

    getChildContext() {
        return {
            app: this.props.app,
            store: this.props.store
        };
    }

    render() {
        return <div>{this.props.layout_component}</div>
    }
}

@observer
export class TidePage extends React.Component<any, any> {
    static displayName = "Tide.Page";

    props: {
        tide: any
    };

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
     * @returns {ReactElement}
     */
    @computed
    get current_view() {
        const page_state = this.page_state;

        let view = page_state.view;
        let data = page_state.data;
        let status = page_state.status;
        let route_name = page_state.route_name;
        let last_update = page_state.last_update;


        if (!status) {
            return <div>[Tide] Waiting to initialize data store.</div>
        }
        if (!route_name) {
            return <div>[Tide] No route set.</div>
        }

        if (status === 'pending') {
            return <div>[Tide] Loading page ... status: {status}</div>
        }

        if (status === 'failed') {
            return <div>[Tide] Attempting to load this page failed.</div>
        }

        // Status at this point should be processing / ok / failed
        return this._create_view(view, data, []);
    }

    /**
     * Ensure that we create a view with a React Element.
     * @private
     * @param {React.Component|React.Element|ReactElement} view
     * @param {*} props
     * @param {Array.<ReactElement>} children
     * @returns {ReactElement}
     */
    _create_view(view, props, children) {
        if (React.isValidElement(view)) {
            return React.cloneElement(view, props, children);
        }

        return React.createElement(view, props, children);
    }

    render() {
        // Page State, includes current view
        const page_state = this.page_state;

        let route_name = page_state.route_name;
        let app_label = page_state.app_label;
        let status = page_state.status;
        let view = this.current_view;
        let last_update = page_state.last_update;

        console.groupCollapsed(`[Tide][Render] [${status}] ${app_label} / ${route_name}`);
        console.info(`[Tide][Render] Updated @ ${last_update}`);
        console.info(`[Tide][Render] Route: ${route_name}`);
        console.info(`[Tide][Render] App: ${app_label}`);
        console.info(`[Tide][Render] Status: ${status}`);
        console.groupEnd();

        if (!route_name || !this.tide.has_app(app_label)) {
            return <InternalError/>
        }

        // Get Application Configuration for current view
        // We'll put store/app in a wrapper at the end so the context
        // is populated down to the View/Presenters that our render has returned
        let app_conf = this.tide.get_app(app_label);

        let app = app_conf.app;
        let store = app_conf.store;
        let layout = app_conf.layout;

        let children = <div>
            {view || <InternalError/>}
            {/*{this.tide.dev_mode ? <DevTools /> : ""}*/}
        </div>;

        let layout_component = this._create_view(layout, {}, children);

        return <TideWrapper app={app}
                            store={store}
                            layout_component={layout_component}/>;
    }
}
