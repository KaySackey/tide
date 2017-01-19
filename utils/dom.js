/*
Returns a promise that resolves only when the document is ready
 */
const onDomReady = (document = window.document) => {
    if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
        return Promise.resolve();
    }
    else {
        return new Promise(resolve => {
            doc.addEventListener('DOMContentLoaded', resolve, false);
        });
    }
};