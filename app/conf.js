import React from "react";
import {View} from "tide/base/view";
import {Link, IndexLink} from "tide/router";
import {action} from "mobx";
import {route} from "tide/router/route";
import {BaseStore} from "tide/model/store";

/**
 * @class
 */
export class BasicApp {
    // Nothing here
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
        this.app      = new BasicApp();
        this.store    = new BasicStore();
    }

    ready(){
        // this will be called by Tide *after* all apps are configured
    }
}