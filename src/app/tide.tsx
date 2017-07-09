import {observer} from "mobx-react";
import * as PropTypes from 'prop-types';
import * as React from "react";
import {bind_all_react_component_methods} from "../utils";
import {TideApp, tide_app} from "./tide_app";
import {TidePage} from "./views/tide_page";
import {TideSettings} from "tide/types";

@observer
export class Tide extends React.Component<any, any>
    /**
     *
     * React requires a top level component to kick off the rendering.
     * Look at TideApp to see the actual application of Tide. This is what is available as a 'tide' variable in your
     * apps, views and presenters.
     */ {
    static displayName = "Tide";
    static childContextTypes = {
        router: PropTypes.object,  //  Required so people can sub in their own routers which may not actually use Tide
        tide: PropTypes.object
    };
    static defaultProps = {
        initial_data: {},
        mode: "development",
        basename: "",
    };

    tide_app: TideApp;
    props: {
        initial_data?: any,
        mode?: "production" | "development" | "staging" | string;
        basename?: string,
        settings: TideSettings
    };

    constructor(props) {
        super(props);
        bind_all_react_component_methods(this);
        this.tide_app = tide_app.setup(this, props);
    }

    getChildContext() {
        return {
            tide: this.tide_app,
            router: this.tide_app.router
        };
    }

    componentWillMount() {
        if (super.componentWillMount) {
            super.componentWillMount();
        }

        this.tide_app.start();

        // Debugging
        (window as any)._tide = this.tide_app;
    }

    componentWillUnmount() {
        this.tide_app.stop();
    }

    render() {
        return (
            <TidePage tide={this.tide_app}/>
        )
    }
}