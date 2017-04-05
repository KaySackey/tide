import {computed, observable} from "mobx";

/**
 * Deals with page state & user state
 */
export class PageStateStore {
    /*
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
     * Return
     * @returns {string} - one of pending, done, failed
     */
    @computed get page_status() {
        return this.page_state.status;
    }

    /**
     * Return the name of the current route being displayed
     * @returns {string}
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

    @computed get app_label(){
        return this.page_state.app_label;
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
     * @param app_conf
     * @param view
     * @param data
     * @returns {*}
     */
    process_transition(route, app_conf, view, data) {
        this.page_state.layout     = app_conf.layout;
        this.page_state.app_label  = app_conf.name;
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

    @observable app_label = null;
    @observable.ref view      = null;
    @observable.ref layout    = null;

    success(data) {
        this.data        = data;
        this.status      = "ok";
        this.last_update = new Date();
    }

    failure(error) {
        this.error  = error;
        this.status = "failed";
    }
}


export const page_state = new PageStateStore();
