// Todo: use warning.js to deprecation warnigns for triggers returning events

export class TideEvent {
    /*
     - name: what is this event called
     -  currentTarget—- representing whom the event handler has attached to (basically this if your event is being handled by the function you are in).
     - target: who dispatched the event
     — detail: some details about event (e.g. current click count)
     - bubbles: does this bubble up through the DOM
     - cancelable: can we cancel this?
     - timeStamp
     */
    constructor(name, target, details) {
        this.name    = name;
        this.target  = target;
        this.details = details;

        this.bubbles       = true;
        this.cancelable    = false;
        this.currentTarget = target;
    }

    stopPropagation() {
        this.bubbles = false;
    }

    allowPropagation() {
        this.bubbles = true;
    }
}

/**
 *
 * Event's in Tide always bubble upwards in the component hierarchy, from child to parent, as determined by the
 * context value of parent. The default components set 'parent' to 'this' in their context before rendering their
 * children.
 *
 *  From within a View or Presenter trigger an event like so:
 *
 *    <a onClick={(e) => e.preventDefault(); this.trigger("send_message", {message: "hello world"}) } />
 *
 *  Within a Presenter or an App, have a method like so:
 *
 *     send_message(){ ... do something ... }
 */
export class BasicEventHandler {
    /**
     * Trigger an event that will bubble up the component hierarchy till it is handled.
     * @param {string} eventName - By convention, the eventName must match the name of a function in a receiving
     *                             component in the hierarchy. However you can override handleEvent's below to do
     *                             whatever you want.
     * @param {Object} details   - Can be any data that you want a receiving function to have about an event
     *                             Examples could be, clicking on a delete button receiving details about which
     *                             item to delete.
     * @returns {Object}         - For historical reasons triggers can return values, this is deprecated
     */
    static trigger(eventName, details = {}) {
        let e = new TideEvent(eventName, this, details);
        return this.handleEvents(e)
    }

    /**
     *
     * @param {TideEvent} e
     * @returns {Object}
     */
    static handleEvents(e) {
        e.currentTarget = this;
        let value       = null;

        if ( e.name in this ) {
            console.debug('Calling ', e.name, ' on ', this);
            value = this[e.name].call(this, e.details, e);
        }
        if ( e.bubbles ) {
            const parent = e.currentTarget.parent;

            if ( parent == undefined && parent == null ) {
                console.debug('Terminal ', e.name, ' on ', this.constructor.name);
            }
            else {
                console.debug('Bubbling ', e.name, ' on ', this.constructor.name, ' --> ', parent);
                parent.handleEvents(e);
            }
        }

        return value;
    }
}
