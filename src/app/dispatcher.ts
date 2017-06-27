import {DispatchError} from "tide/exceptions";
import {runInAction} from "mobx";
import {TideApp} from "tide/app/tide_app";

export class TideDispatcher {
    controller: TideApp;

    /**
     * @param {TideApp} controller
     */
    constructor(controller) {
        this.controller = controller;
    }

    /**
     *
     * Validate that we can dispatch upon this route
     * Required to fulfill the interface of a dispatcher.
     *
     * @param {Route} route
     * @throws {DispatchError} if the route cannot be validated
     */
    validate(route) {
        let handler = route.handler;
        let name = route.name.trim();

        if ( !(handler instanceof Function) ) {
            throw new DispatchError(
              `Dispatch expects the handler to be a function. It was ${JSON.stringify(handler)}`)
        }

        if (typeof name !== 'string') {
            throw new DispatchError(
              `Dispatch expects the name be a string. It was ${JSON.stringify(name)}`)
        }else if (name.includes("/")){
            throw new DispatchError(
              `Dispatch expects route name to not include forward slashes. It was ${JSON.stringify(name)}`)
        }
    }

    /**
     * Call the dispatch function.
     *
     * If the dispatcher was a function. It will call the function directly.
     * Required to fulfill the interface of a dispatcher.
     * All of the above will be given to the dispatched function which must have a signature of
     *      handler(Tide, Object: params, RouteMatch: route_match)
     *
     *
     * @param {RouteMatch} matched_route
     * @throws DispatchError if there is any trouble handling the dispatch
     */
    dispatch(matched_route) {
        let route = matched_route.route;
        let params = matched_route.params;
        let handler = route.handler;

        if(this.controller.pending){
            alert("Page is still in a transition. Cannot dispatch a new one.");
            return;
        }
        if(!(handler instanceof Function)){
            throw new DispatchError(
              `Dispatch expects the handler to be a function. It was ${JSON.stringify(handler)}`)
        }

        // Run dispatch
        runInAction(`Dispatching:  ${route.name}`, () => {
            handler.call(null, this.controller, matched_route, params)
        });
    }
}
