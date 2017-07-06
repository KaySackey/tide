import * as React from "react";
import * as PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {action} from "mobx";
import {use, bind_all_react_component_methods} from "../utils";
import {BasicEventHandler} from "../base/events";
import {TidePage} from "./views/tide_page";
import {TideApp} from "./tide_app";
import {app_conf as example_conf} from "./example_app";

/**
 *
 * React requires a top level component to kick off the rendering.
 * Look at TideApp to see the actual application of Tide. This is what is available as a 'tide' variable in your
 * apps, views and presenters.
 */
@observer
export class Tide extends React.Component<any, any> {
    tide_app: TideApp;

    static displayName       = "Tide";
    static childContextTypes = {
        // Tide Bubbling
        parent: PropTypes.object,
        // Application specific
        app   : PropTypes.object,
        router: PropTypes.object,
        tide  : PropTypes.object
    };
    static propTypes         = {
        initial_data: PropTypes.object,
        mode        : PropTypes.oneOf(["string", "development"]),
        basename    : PropTypes.string,
        apps        : PropTypes.array
    };
    static defaultProps      = {
        initial_data: {},
        mode        : "development",
        basename    : "",
        apps        : [example_conf]
    };

    constructor(props) {
        super(props);
        use(this, BasicEventHandler);
        bind_all_react_component_methods(this);
        this.tide_app = new TideApp(this, props);
    }

    getChildContext() {
        return {
            tide  : this.tide_app,
            app   : null,           // we could put a fake store that just throws errors here? .... app is defined via the TideWrapper
            parent: this,           // we could put some kind of logging here thanks to catching all triggers
            router: this.tide_app.router
        };
    }

    @action componentWillMount() {
        if(super.componentWillMount){
            super.componentWillMount();
        }

        this.tide_app.start();

        // Debugging
        (window as any).__debug__ = {
            tide  : this.tide_app,
            router: this.tide_app.router,
            apps  : this.tide_app.apps,
            mode  : this.tide_app.mode
        };
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