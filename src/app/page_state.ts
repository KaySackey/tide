import {action, computed, observable} from "mobx";

export class PageStateStore {
    /*
    Deals with page state & user state


    States:
    - initial: nothing has been rendered, no data has been received, we are unsure of what application to use or what route to follow

    - pending: we know what route & app to render, and are awaiting data, before rendering the view. Set internally by PageStateStore.process_transition
            - This is triggered as a result of the routing
            - todo: maybe rename to 'routing'
    - ok: view has rendered on the page, and we are waiting further user action
    - processing: view has been rendered but needs to be locked to interaction, in order to service a user request. called externally.

     */
    @observable.ref page_state = new InternalPageState();

    refresh() {
        this.page_state        = new InternalPageState();
        this.page_state.status = "initial";
    }

    /**
     * Set the current page state to pending
     */
    set_processing() {
        this.page_state.status = 'processing'
    }

    /**
     * Set the current page state to pending
     */
    stop_processing() {
        this.page_state.status = 'ok'
    }

    /**
     * Return true if the page state is pending
     * @returns {boolean}
     */
    @computed get pending() {
        return this.page_state.status === "pending"
    }

    /**
     * Return the name of the current route being displayed
     */
    @computed get route_name() {
        return this.page_state.route_name;
    }

    @computed get view() {
        return this.page_state.view;
    }

    @computed get data() {
        return this.page_state.data;
    }

    @computed get last_update() {
        return this.page_state.last_update;
    }


    @computed get status(){
        return this.page_state.status;
    }

    @computed get layout(){
        return this.page_state.layout;
    }

    update_current_view(data) {
        this.page_state.success(data);
    }

    /**
     * Transition to a new state
     * @param route
     * @param view
     * @param data
     */
    process_transition(route, layout, view, data) : Promise<any> {
        this.page_state.layout     = layout;
        this.page_state.route_name = route.name;
        this.page_state.view       = view;
        this.page_state.data       = {};
        this.page_state.status     = 'pending';

        let data_promise;
        if ( data instanceof Promise ) {
            data_promise = data;
        }
        else {
            data_promise = Promise.resolve(data);
        }

        return data_promise
          .then((response) => {
              this.page_state.success(response);
              return response;
          }).catch(err => {
              console.error(err);
              this.page_state.failure(err);
              throw err;
          });
    }
}


/**
 * This is the current state of the page.
 * It should only be transformed by classes like TideStore which know what they're doing.
 */
class InternalPageState {
    @observable status      = "initial";
    @observable data        = {};
    @observable error       = null;
    @observable route_name;
    @observable last_update = new Date();

    @observable.ref view      = null;
    @observable.ref layout    = null;

    @action success(data) {
        this.data        = data;
        this.status      = "ok";
        this.last_update = new Date();
    }

    @action failure(error) {
        this.error  = error;
        this.status = "failed";
    }
}
