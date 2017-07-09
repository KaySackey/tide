import {computed} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import * as React from "react";
import {ExistingApplications} from "tide/types";
import {TideApp} from "./tide_app"
import {bind_all_react_component_methods} from "tide/utils";

export interface ITideContext {
    tide: TideApp
}

export const defaultContextTypes = {
    tide: PropTypes.object
};


@observer
export class View extends React.Component<any, any> {
    static contextTypes = defaultContextTypes;
    static childContextTypes = defaultContextTypes;
    static displayName = "TideView";

    context: ITideContext;

    constructor(props) {
        super(props);
        bind_all_react_component_methods(this);
        // Debugging note:
        // The display name will always be Tide.RenderingContext until the component has been constructed.
        // This complicates debugging because if you throw an error before at least one instance of your class has
        // been created then it will be called Tide.View
        // To work around this define static displayName on your inheriting classes.
        (this as any).constructor.displayName = Object.getPrototypeOf(this).constructor.name;
    }

    get tide() : TideApp {
        return this.context.tide;
    }

    get apps() : ExistingApplications{
        return this.tide.apps;
    }

    @computed
    get current_user() {
        return this.tide.current_user;
    }
}