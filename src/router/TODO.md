Todo: get url by applying history.createHref

  Todo: Complete support for hash urls. Right now its really only an HTML 5 router.

  Todo: piping from one router to another
      Take advantage of greedy call to pull in all from a certain branch, then pass it to another router.
      crossroads.addRoute("/hello/*", ...dispatch...)

  - Hash-bang vs history routes
  - state backed up to route
  - active-link-class
  - transition on load - should we execute on the current url when its load
  - suppress transition errors - suppress errors called within transition



  Name generation: can be pulled out into its own function

   Other possibiliities for name gen
   /**
    *
    * router(route, store.show_welcome)
    *      ... 1. try to get the name from the function
    *      ... if bound; look into context and add the name of the object it is bound to to the name
    *      ...
    *      ... 2. if no name is given give default by serializing the route removing braces and / from from string
    *                  /hello/{id}/ ==> a route named hello_id
    *      ...
    *      ...
    */



Dispatch.
- if we don't find the name of a handler on a store; we could call special function dispatch() on the store rather than throwing an error.


