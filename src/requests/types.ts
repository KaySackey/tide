/*
Note: A critical assumption made is that the backend speaks JSON so these functions send/receive JSON only!
*/
export const ContentTypes = {
    json: "application/json",
    html: "text/html",
    text: "text/plain"
};

export const Credentials = {
    same_origin: 'same-origin',     // make include to send cookies on CORS requests too
    include    : 'include'
};

