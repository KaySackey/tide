import * as React from "react";
import {View} from "../base/view";
import {BaseStore} from "../model/store";
import {TideApp} from "./tide_app";

export class BasicApp {
    store: BaseStore; // will be set via Tide itself
    tide: TideApp; // will be set via Tide itself
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
    name: string | null;
    verbose_name: string;

    app: object;
    store: BaseStore;
    layout: any;

    constructor() {
        this.name = this.name || this.constructor.name;
        this.verbose_name = this.verbose_name || this.name;

        this.layout = BasicLayout;
        this.app = new BasicApp();
        this.store = new BasicStore();
    }

    ready(data: any): void {
        // this will be called by Tide *after* all apps are configured
    }
}