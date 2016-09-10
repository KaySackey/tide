import * as requests from "./requests";
import {path as utils_path} from "tide/utils";

/***
 * Executes Queries over HTTP.
 * This is essentially JSON-RPC due to it using tide.requests
 */
export class Http {
    /**
     * Execute a given query, using its url and data.
     * Will make an HTTP fetch request
     * @param {Query} query
     * @returns {Promise}
     * @throws ReferenceError - If you use a method apart from get/post/put/delete
     */
    static execute(query) {
        return new Promise((resolve, reject) => {
            try {
                const q   = query;
                const url = Http.path(q.endpoint, q.data);
                let fetch_request;
                
                switch (q.method) {
                    case "get":
                        fetch_request = requests.get(url, q.data);
                        break;
                    case "post":
                        fetch_request = requests.post(url, q.data);
                        break;
                    case "put":
                        fetch_request = requests.put(url, q.data);
                        break;
                    case "delete":
                        fetch_request = requests.del(url);
                        break;
                    default:
                        let err = ReferenceError(`Could not execute method ${query.method} of query ${query.name}`);
                        return reject(err)
                }
                
                return resolve(fetch_request);
            }
            catch (err) {
                return reject(err)
            }
        })
    }
    
    static path(pattern, params) {
        return utils_path(pattern, params)
    }
}