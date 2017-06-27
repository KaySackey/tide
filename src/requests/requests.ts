import {InvalidResponse} from 'exceptions';
import {encode} from "./querystring";
import {ContentTypes, Credentials} from "./types";
import {debug_logging} from "./logging";

export const DefaultRequestOptions = {
    'content_type': ContentTypes.json,
    'method': 'GET',
    'cache': 'default',
    'mode': 'cors',
    'redirect': 'follow',
    'referrer': 'client',
    'referrerPolicy': 'origin-when-cross-origin',
    'credentials': Credentials.same_origin
    // 'integrity' : sub-resource integrity value hash
    // 'body'" request body: blob/buffersource/formdata/urlsearchparams/usvstring
};

export function request(url, options) {
    let o = {...DefaultRequestOptions, ...options};
    let absUrl;

    let headers = new Headers({
        "Content-Type": options.content_type,
        "Accept"      : options.content_type
    });


    if(url.includes('http')){
        absUrl = url;
    }else{
        let start = '';

        start = window.location.protocol + "//" + window.location.hostname;
        if(window.location.port){
            start = start + ":" + window.location.port;
        }

        absUrl = start + url;
    }

    return fetch(absUrl, {
        method     : o.method,
        mode       : o.mode,
        cache      : o.cache,
        headers    : headers,
        credentials: o.credentials,
        body       : o.body
    })
      .then((response) => debug_logging(response))
      .then((response) => {
          if (response.ok) {
              return response.json()
          }
          else {
              throw new InvalidResponse(response);
          }
      })
}

export function get(uri, queries = null) {
    let query_string = queries ? encode(queries) : "";
    let full_uri = query_string ? `${uri}?${query_string}` : uri;

    return request(full_uri, {method: 'GET'});
}

export function post(uri, body) {
    return request(uri, {method: 'POST', body: JSON.stringify(body)});
}

export function put(uri, body) {
    return request(uri, {method: 'PUT', body: JSON.stringify(body)});
}

export function del(uri) {
    return request(uri, {method: 'DELETE'});
}

export function upload(uri, file, __data) {
    //var input = document.querySelector('input[type="file"]')
    //var file = input.files[0];

    const data = new FormData();
    data.append('file', file);

    return request(uri,  {method: 'POST', body: data})
}

