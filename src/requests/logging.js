let log_to_console = true;//(process.env.NODE_ENV === 'development');

export const debug_logging = (response) => {
    if (log_to_console) {
        console.debug("Request Returned", {
            'ContentType': response.headers.get('Content-Type'),
            'Status'     : response.status,
            "StatusText" : response.statusText
        });
    }

    return response;
};
