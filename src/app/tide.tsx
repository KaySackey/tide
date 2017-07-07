import {observer} from "mobx-react";
import * as PropTypes from 'prop-types';
import * as React from "react";
import {bind_all_react_component_methods} from "../utils";
import {TideApp} from "./tide_app";
import {TidePage} from "./views/tide_page";


@observer
export class Tide extends React.Component<any, any>
    /**
     *
     * React requires a top level component to kick off the rendering.
     * Look at TideApp to see the actual application of Tide. This is what is available as a 'tide' variable in your
     * apps, views and presenters.
     */ {
    tide_app: TideApp;

    static displayName = "Tide";
    static childContextTypes = {
        // Application specific
        app: PropTypes.object,
        router: PropTypes.object,
        tide: PropTypes.object
    };
    static propTypes = {
        initial_data: PropTypes.object,
        mode: PropTypes.oneOf(["string", "development"]),
        basename: PropTypes.string,
        apps: PropTypes.array
    };
    static defaultProps = {
        initial_data: {},
        mode: "development",
        basename: "",
        apps: []
    };

    constructor(props) {
        super(props);
        bind_all_react_component_methods(this);
        this.tide_app = new TideApp(this, props);
    }

    getChildContext() {
        return {
            tide: this.tide_app,
            app: null,           // we could put a fake store that just throws errors here? .... app is defined via the TideWrapper
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

    /**
     * Render the presenter
     */
    render() {
        return (
            <TidePage tide={this.tide_app}/>
        )
    }
}