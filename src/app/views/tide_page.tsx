import {computed} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {TideApp} from "tide/app/tide_app";
import {InternalError} from "./basic";

@observer
export class TidePage extends React.Component<any, any> {
    static displayName = "TidePage";

    props: {
        tide: TideApp
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
     */
    @computed
    get current_view() {
        const page_state = this.page_state;

        let view = page_state.view;
        let data = page_state.data;
        let status = page_state.status;
        let route_name = page_state.route_name;

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
     */
    private _create_view(view: React.ComponentClass<any>, props: any, children: React.ReactNode): React.ReactElement<any> {
        if (React.isValidElement(view)) {
            return React.cloneElement(view, props, children);
        }

        return React.createElement(view, props, children);
    }

    render() {
        // Page State, includes current view
        const page_state = this.page_state;

        let route_name = page_state.route_name;
        let status = page_state.status;
        let view = this.current_view;
        let last_update = page_state.last_update;
        let layout = page_state.layout;

        console.debug(`[Tide][Render] [${status}] - ${route_name}  -       Updated @ ${last_update}`);

        if (!route_name) {
            return <InternalError/>
        }

        let children = <div>
            {view || <InternalError/>}
        </div>;

        let layout_component = this._create_view(layout, {}, children);
        return <div>{layout_component}</div>
    }
}
