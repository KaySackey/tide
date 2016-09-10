import React from "react";
import {RenderingContext} from "./context";

/**
 * @class
 */
export class View extends RenderingContext {
    static displayName = "Tide.View";

    /**
     * Pulls a trigger, this should be overridden if you want to do something special.
     * @param name
     */
    onAct(name) {
        this.trigger(name)
    }

    /**
     * Binds onAct with a variable.
     * The default onAct is simply
     *
     *      (name) => this.trigger(name)
     *
     * This function can be used to simplify binding triggers repetitively in a view that handles events.
     * @param {string} name
     * @returns {function(this:*)}
     */
    act(name) {
        return (event) => {
            event.preventDefault();
            this.onAct(name);
        }
    }
}