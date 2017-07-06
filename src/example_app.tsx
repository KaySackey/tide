import * as React from "react";
import {action} from "mobx";
import {View} from "tide/index";
import {Link, IndexLink} from "tide/router";
import {route} from "tide/router/route";
import {BaseStore} from "tide/model/store";
import {BasicApp} from "tide/app/conf";

/** Views **/
export class Welcome extends View {
    static displayName = "Tide.Welcome";
    props: {
        title: string,
        status: string
    };

    render() {
        let {status, title} = this.props;

        return (
          <div>
              <h1>{title}</h1>
              <div>
                  This page is showing because you haven't configured any routes.
                  Please do so via your app.
              </div>
          </div>
        )
    }
}

export class NotFound extends View {
    static displayName = "Tide.NotFound";
    render() {
        return (
          <div>
              <h1>Tide: Page Not Found</h1>
              <div>You are seeing this because you haven't yet configured a real 404 page</div>
              <div>Go back to the <IndexLink to="/">home page</IndexLink></div>
          </div>
        )
    }
}

/*
First we need a controller. This guy is going to display pages.
 */
class ExampleController {
    @action
    static show_welcome(tide, request) {
        let params = request.params;

        // request.layout = ExampleLayout; // you can change the layout in stream

        tide.render(request, Welcome, {
            title: `Hi ${params.username}! Welcome to Tide!`
        })
    }

    @action
    static show_404(tide, request, params) {
        tide.render(request, NotFound, {
            title: "Hey 404!"
        })
    }
}

/**
 * Controllers need routes in order to be picked up and used
 */
export const routes = [
    // Because we are decorating our functions with @action, we need to specify the name
    // MobX will mangle the name down to 'res'

    route("/welcome/{username}/", ExampleController.show_welcome, 'show_welcome'),
    route("/404/", ExampleController.show_404, 'show_404')
];


/**
 * A layout is needed so we can show a page of some kind within it.
 */
export class ExampleLayout extends View {
    render() {
        // Router configuration ignores dynamic routes under getChildRoutes or getIndexRoute.
        // Use getComponent or getComponents on your routes if you want code splitting
        let status     = this.tide.page_state.page_state;
        let route_name = this.tide.page_state.route_name;
        console.log("[Tide Example] Rendering... ");

        return (
          <div className="l-container">
              <Menu current_user={this.current_user}/>
              <StatusDisplay route_name={route_name} status={status}/>
              {/* A layout always displays its children. Or else there's no point to it. */}
              {this.props.children}
          </div>
        )
    }
}

const Menu = ({current_user}) => (
  <div>
      <h1>Menu</h1>

      <Link to="show_welcome" params={{"username": current_user.name}}>
          <button className="l-btn l-btn-secondary">Welcome</button>
      </Link>

      <Link to="show_404">
          <button className="l-btn l-btn-secondary">404</button>
      </Link>
  </div>
);

const StatusDisplay = ({route_name, status}) => (
  <div>
      <h1>View</h1>
      <div>
          <div>Route name: {route_name}</div>
          <div>Status: {status}</div>
      </div>
  </div>
);

class ExampleStore extends BaseStore {
    static meta = {
        queries: new Map()
    };
}

class ExampleApp extends BasicApp {
    // Nothing here
}


/** Configuration */
export class AppConf {
    name     = "example";
    routes   = routes;
    layout   = ExampleLayout;
    app      = new ExampleApp();
    store    = new ExampleStore();

    ready(){
        // this will be called by Tide *after* all apps are configured
    }
}

export const app_conf = new AppConf();