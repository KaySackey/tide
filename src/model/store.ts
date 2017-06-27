import {map as observableMap} from "mobx";
import {bind_all_methods} from "utils";
import {QueryNotFound} from "./exceptions";
import {Query} from "./query";

export class BaseStore {
    _meta: any;
    state: any;

    static meta = {
        queries: new Map()
    };

    cache: Map<any, any> = new Map();
    bin: any = observableMap();
    uninitialized: boolean = true;

    constructor() {
        bind_all_methods(this);

        this._meta = (this as any).constructor.meta;
    }

    // Operations on the bin store
    // The bin store is a basic key value store.
    // A good practice is to use it to store ui state like "ui.message.sent"
    // then you can conditionally show data based on it
    // The bin is an observable so the view can react based on its values

    has(key) {
        return this.bin.has(key)
    }

    set(key, value) {
        if (value === undefined) {
            throw new TypeError("Value in a store, cannot be set to undefined.")
        }
        this.bin.set(key, value);
        return this.bin.get(value);
    }

    get(key, default_value? : any) {
        if (!this.bin.has(key)) {
            return default_value;
        }

        return this.bin.get(key);
    }

    counter(key) {
        return this.get(key, 0)
    }

    incr(key, maximum?) {
        let val = this.counter(key);

        if ((maximum !== undefined && maximum !== null) && val >= maximum) {
            return val;
        }

        return this.set(key, val + 1)
    }

    decr(key, minimum = 0) {
        let val = this.counter(key);

        if ((minimum !== undefined && minimum !== null) && val <= minimum) {
            return val;
        }

        return this.set(key, val - 1)
    }

    go(name, data) {
        // Get a query
        let query = (name instanceof Query) ? name : this.get_query(name, data);
        // this.log_query(query, data);
        return query.execute();

        // Get a response from cache w/ logging
        //        let response =
        //            this.log_query(query, data)
        //.get_cached(query);

        // Send it or execute a new one
        //return response || this.set_cached(query);
    }

    get_cached(query) {
        if (query.can_be_cached) {
            if (this.cache.has(query.cache_key)) {
                return this.cache.get(query.cache_key)
            }
        }

        return null;
    }

    set_cached(query) {
        let response_promise = query.execute();

        return response_promise.then((response) => {
            if (query.can_be_cached) {
                this.cache.set(query.cache_key, response)
            }

            return response;
        });
    }


    get_query(name, data) {
        if (!this.queries.has(name)) {
            throw new QueryNotFound(name);
        }

        const Query = this.queries.get(name);
        return new Query(data, this);
    }

    /**
     * Return Map of Queries this application can perform
     * @returns {Map}
     */
    get queries() {
        return this._meta.queries;
    }
}