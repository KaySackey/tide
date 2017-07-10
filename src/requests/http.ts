import axios, {AxiosPromise} from 'axios';
import {tide} from "tide/instance";
import {path as utils_path} from "tide/utils";
import {ContentTypes} from "./constants";

const requests = axios.create({
    timeout: 1000,
    headers: {
        "Content-Type": ContentTypes.json,
        "Accept": ContentTypes.json,
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

export class Http {
    /**
     * Execute a given query, using its url and data.
     * Will make an HTTP fetch request
     * @param {Query} query
     * @returns {Promise}
     * @throws ReferenceError - If you use a method apart from get/post/put/delete
     */
    static execute(query): AxiosPromise {
        return new Promise((resolve, reject) => {
            try {
                const {method, name, data, endpoint} = query;
                const url = Http.path(endpoint, data);

                const fetch_request =
                    Http._request(url, method, name, data)
                        .then(Http.debug_logging)
                        .then(Http.parse_response);

                return resolve(fetch_request);
            }
            catch (err) {
                return reject(err)
            }
        })
    }

    static _request(url: string, method: string, name: string, data: any): AxiosPromise {
        let fetch_request;

        switch (method) {
            case "get":
                fetch_request = requests.get(url, {
                    params: data
                });
                break;
            case "post":
                fetch_request = requests.post(url, data);
                break;
            case "put":
                fetch_request = requests.put(url, data);
                break;
            case "head":
                fetch_request = requests.head(url, {
                    params: data
                });
                break;
            case "patch":
                fetch_request = requests.patch(url, data);
                break;
            case "delete":
                fetch_request = requests.delete(url);
                break;
            default:
                throw new ReferenceError(`Could not execute method ${method} of query ${name}`);
        }

        return fetch_request;
    }

    static parse_response(response) {
        /*
        Transform from AxiosResponse to a regular HTML5 Standard response
         */
        // let body = response.body || JSON.stringify(response.data);
        // return new Response(body, {
        //             status: response.status,
        //             statusText: response.statusText,
        //             headers: new Headers(response.headers)
        //         })

        // Whelp! can't do that... so we're going to just return raw json
        return response.data
    }

    static debug_logging(response) {
        if (tide.dev_mode) {
            console.debug("Request Returned", {
                // 'ContentType': response.headers.get('content-Type'),
                'Status': response.status,
                "StatusText": response.statusText
            });
        }

        return response;
    }


    static path(pattern, params) {
        return utils_path(pattern, params)
    }
}