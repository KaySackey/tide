Spec
--

    store.go(<string: Name of Query>, <object: context>, <object: data>)

  - Queries are classes defined under model/query and attached to a given store.

  - Context is used by the constructor of the query in order to properly initialize itself. For example, if queries are made against REST-like endpoints, then context might have the identifier of the the resource being accessed.

  - Data is used sent to the constructed query, and a response is returned as a `Promise`.

Examples
--
    store.go("ThreadShow", {id: 1})
    store.go("ThreadModifyMany", [1, 2, 3, 4, 5], {action: "inbox")
    store.go("ThreadModify", {id: 1}, {action: "inbox"})
    store.go("ThreadListMessages", {id: 1}, {page: 1} )
    store.go("ThreadReply", {id: 1}, {message: "hello world!"})


Chaining via Promises
--


    store.go("ThreadShow", {id: 1}).then( thread => {
        // do something with the thread, like update the view
    })


