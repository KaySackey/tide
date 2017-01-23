import React, {PropTypes} from "react";
import {action} from "mobx";
import {use, bind_all_react_component_methods} from "tide/utils";
import {MobxObserver} from "tide/base/base";
import {BasicEventHandler} from "tide/base/events";
import {TidePage} from "./views/tide_page";
import {TideApp} from "./app";
import {app_conf as example_conf} from "./example_app";

/**
 * @class
 *
 * React requires a top level component to kick off the rendering.
 * Look at TideApp to see the actual application of Tide. This is what is available as a 'tide' variable in your
 * apps, views and presenters.
 */
export class Tide extends MobxObserver {
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
        initial_data: React.PropTypes.object,
        mode        : React.PropTypes.oneOf(["string", "development"]),
        basename    : React.PropTypes.string,
        apps        : React.PropTypes.array
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
            app   : null,           // we could put a fake store that just throws errors here?
            parent: this,           // we could put some kind of logging here thanks to catching all triggers
            router: this.tide_app.router
        };
    }

    @action componentWillMount() {
        super.componentWillMount();
        this.tide_app.start();

        // Debugging
        window.__debug__ = {
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
     * @returns {XML}
     */
    render() {
        return (
          <TidePage tide={this.tide_app}/>
        )
    }
}