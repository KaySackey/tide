import {TideApp} from "tide/app/tide_app";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {BaseStore} from "tide/model/store";
import * as PropTypes from "prop-types";
import * as React from "react";
import {bind_all_react_component_methods, use} from "tide/utils";
import {BasicEventHandler} from "./events";


export interface ITideContext {
    // Tide Bubbling
    parent: object,

    //Application specific
    router: object,
    app: object,
    store: BaseStore,
    tide: TideApp
}


export const defaultContextTypes = {
    // Tide Bubbling
    parent: PropTypes.object,

    // Application specific
    router: PropTypes.object,
    app: PropTypes.object,
    store: PropTypes.object,
    tide: PropTypes.object
};


@observer
export class RenderingContext extends React.Component<any, any> implements BasicEventHandler{
    static contextTypes = defaultContextTypes;
    static childContextTypes = defaultContextTypes;
    static displayName = "Tide.RenderingContext";

    context: ITideContext;

    // Will be over-wrote by trait
    trigger(eventName: any, details?: any){}
    handleEvents(e: any){}


    constructor(props) {
        super(props);
        bind_all_react_component_methods(this);
        // Debugging note:
        // The display name will always be Tide.RenderingContext until the component has been constructed.
        // This complicates debugging because if you throw an error before at least one instance of your class has
        // been created then it will be called Tide.View
        // To work around this define static displayName on your inheriting classes.

        (this as any).constructor.displayName = Object.getPrototypeOf(this).constructor.name;
        use(this, BasicEventHandler);
    }


    get tide() {
        return this.context.tide;
    }

    get parent() {
        return this.context.parent;
    }


    get app(): any {
        if (!this.context.app) {
            throw Error(`Not running within an applications context`);
        }

        return this.context.app;
    }

    get store() {
        return this.context.store;
    }

    @computed
    get current_user() {
        return this.tide.current_user;
    }

    @computed
    get app_state() {
        return this.store.state;
    }

    @computed
    get ui_state() {
        return this.store.state.ui;
    }
}
