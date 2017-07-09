import {Http} from "tide/requests/http";
import {QueryError} from "tide/exceptions";
import {deserialize} from "serializr";
import {action} from "mobx";
import {AxiosError} from "axios";

export class Query {
    /**
     *  An object that represents a query to the backend database.
     *  In this current case, all our queries happen over a kind of JSON-RPC via HTTP.
     *
     *  @example
     *  class ModifyUser extends Query {
     *     static meta = {
     *         expected  : {},
     *         endpoint  : "/users/modify_all",
     *         method    : "put"
     *     };
     *
     *     method   = "put";
     *     data     = {};
     *     expected = {};
     *
     *     constructor(data) {
     *         super(data);
     *         // can do stuff to massage in the data
     *    }
     *  }
     */

    // Beware! Meta values are singletons!
    // You must assign them via a function
    static meta : any = {
        can_cancel: false,
        can_be_cached: false,
        expected: null,
        endpoint: "",
        method: "get"
    };

    /**
     * The result from the response after deserialization
     * @type {*|null}
     * @private
     */
    _result?: any = null;

    // Todo: Add types for meta
    method: string;
    endpoint: string;
    expected?: any;
    can_cancel: boolean;
    data: any;
    response: Promise<any>;
    meta: any;


    constructor(data? : any) {
        const meta = (this as any).constructor.meta;
        this.method = meta.method;
        this.expected = meta.expected;
        this.endpoint = meta.endpoint;
        this.can_cancel = meta.can_cancel;
        this.data = data || meta.data;
        this.setup(data)
    }

    /**
     * It can be handy to re-implement this in a base class to show what is actually required in data
     * @param data
     */
    setup(data){
        this.data = data || {};
    }

    get cache_key() {
        if ( this.method === "get" ) {
            return Http.path(this.endpoint, this.data);
        }

        return null;
    }

    get can_be_cached() : boolean {
        return this.meta.can_be_cached && this.cache_key !== null;
    }

    get name() {
        return this.constructor.name;
    }

    get result() {
        return this._result;
    }

    /**
     * Execute this query
     * @returns {Promise}
     */
    @action execute() {
        this.response = Http.execute(this)
          .then((json) => this.deserialize(json))
          .catch(error => this.handle_error(error));

        return this.response
    }

    handle_error(error : AxiosError){
        let response = error.response;
        let context;
        if(response && response.status === 400){
            context = response.data;
        }
        throw new QueryError(this, error, context)
    }

    deserialize(json) {
        if ( this.expected ) {
            let schema = this.expected;

            return new Promise((resolve, reject) => {
                return deserialize(schema, json.result, (err, model_obj) => {
                    if ( err ) {
                        return reject(err)
                    }
                    this._result = model_obj;
                    return resolve(model_obj);
                })
            });
        }

        return json
    }
}
