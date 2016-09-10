import React from "react";
import {View} from "tide/base/view";
import {Link, IndexLink} from "tide/router";
import {action} from "mobx";
import {route} from "tide/router/route";
import {BaseStore} from "tide/model/store";
import {BaseApp} from "tide/base/app";

/**
 * @class
 */
export class BasicApp {
    // Nothing here
    // During rendering a trigger will bubble up all the way till it hits the app instance that's currently running

    // don't use react lifecycle component; even if it is a React Component.
    // in the future BaseApp will *not* be a React component; so setup everything in props like this is a normal object
}
/**
 * @class
 */
export class BasicStore extends BaseStore{
    
}
/**
 * @class
 */
class BasicLayout extends View {
    render(){
        return(
          <div>{props.children}</div>
        )
    }
}
/**
 * @class
 */
export class BasicConf {
    constructor(){
        this.name     = null;
        this.routes   = [];
        this.layout   = BasicLayout;
        this.app      = <BasicApp />;
        this.store    = new BasicStore();
    }

    ready(){
        // this will be called by Tide *after* all apps are configured
    }
}