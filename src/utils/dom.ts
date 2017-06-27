function onDomReady (document = window.document) {
    /*
    // Todo: Remove?
    // Maybe deprecated
    Returns a promise that resolves only when the document is ready
     */
    if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
        return Promise.resolve();
    }
    else {
        return new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve, false);
        });
    }
};