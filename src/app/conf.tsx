import * as React from "react";
import {View} from "../base/view";
import {BaseStore} from "../model/store";


export class BasicApp {
    // Nothing here
}


export class BasicStore extends BaseStore {

}

class BasicLayout extends View {
    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}

export class BasicConf {
    name : string | null;
    app: object;
    store: BaseStore;
    layout: any;

    constructor() {
        this.name = null;
        this.layout = BasicLayout;
        this.app = new BasicApp();
        this.store = new BasicStore();
    }

    ready(any) : void {
        // this will be called by Tide *after* all apps are configured
    }
}