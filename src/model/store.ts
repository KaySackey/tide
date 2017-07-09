import * as mobx from "mobx";
import {QueryNotFound} from "tide/exceptions";
import {bind_all_methods} from "tide/utils";
import {Query} from "./query";
declare interface IApplicationState {
    _meta: any;
    state: any;
    cache: Map<string, any>;
    bin: mobx.IMap<string, any>;
    queries: mobx.IMap<string, Query>;

    has(string): boolean;
    set(string, any): any;
    get(string, default_value?: any): any;
    counter(string): number;

    increment(string, maximum?: number): number;
    decrement(string, minimum?: number): number;

    go(name: string, data: any): Query;
    get_cached(query: Query): (any | null);
    set_cached(query: Query): Promise<any>;
}


export class BaseStore implements IApplicationState {
    _meta: any;
    state: any;
    cache: Map<string, any> = new Map();
    bin: any = mobx.observable.map();

    ui : any = {};

    static meta = {
        queries: new Map()
    };

    constructor() {
        bind_all_methods(this);
        this._meta = (this as any).constructor.meta;
    }

    // Operations on the bin store
    // The bin store is a basic key value store.
    // A good practice is to use it to store ui state like "ui.message.sent"
    // then you can conditionally show data based on it
    // The bin is an observable so the view can react based on its values

    has(key: string): boolean {
        return this.bin.has(key)
    }

    set(key: string, value: any) {
        if (value === undefined) {
            throw new TypeError("Value in a store, cannot be set to undefined.")
        }
        this.bin.set(key, value);
        return this.bin.get(value);
    }

    get(key: string, default_value?: any) {
        if (!this.bin.has(key)) {
            return default_value;
        }

        return this.bin.get(key);
    }

    counter(key: string) {
        return this.get(key, 0)
    }

    increment(key, maximum?) {
        let val = this.counter(key);

        if ((maximum !== undefined && maximum !== null) && val >= maximum) {
            return val;
        }

        return this.set(key, val + 1)
    }

    decrement(key, minimum = 0) {
        let val = this.counter(key);

        if ((minimum !== undefined && minimum !== null) && val <= minimum) {
            return val;
        }

        return this.set(key, val - 1)
    }

    go(name, data) {
        // Get a query
        // Get a response from cache w/ logging
        //        let response =
        //            this.log_query(query, data)
        //.get_cached(query);

        // Send it or execute a new one
        //return response || this.set_cached(query);

        let query = (name instanceof Query) ? name : this.get_query(name, data);
        return query.execute();
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