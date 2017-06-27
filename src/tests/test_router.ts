import {Router} from "../src/router/router";

class Store {
    show(params, matched_route){
        console.log("Show called!");
    }
    say(params, matched_route){
        console.log("Saying ... ", params.word);
    }
}

let store = new Store();
let r = new Router(store, {basename: "/tests"});
r.route("/show/", _ => console.log('hi'));
r.route("/say/{word}/", "say");
r.start();

// Maybe alternative?
// r.get("show").dispatch();
r.go('/tests/show/');
r.go('/tests/say/Hello/');
console.log("Show Path: ", r.path('show')); // tests that we have a route w/ the same name as the function created
console.log("Say Path: ", r.path('say', {word: "Hello"}));

// todo test bypassed will give something
// error handling
    // if its tide; we can ignore that aspect as the App will do it
    // all renders return a promise; and we'll catch the errors internally

// route names cannot include forwards slashes
// link helper will output anything with forward slashes as a normal URL


// Usage: https://github.com/millermedeiros/crossroads.js/wiki/Examples

/**
 *
 * import {default as crossroadsM} from "crossroads";

 var crossroads = crossroadsM.create();
 crossroads.normalizeFn = crossroadsM.NORM_AS_OBJECT;
 var sectionRoute = crossroads.addRoute('/show/{id}/',(section, id) => {
     console.dir(id);
     console.log(section +' - '+ id);
 });


 //will match `sectionRoute` passing "news" and `123` as param
 crossroads.parse('/show/1/', ['hi']);



 NORM_AS_OBJECT produces something like:

 { '0': '1',
   id: '1',
   request_: '/show/1/',
   vals_: [ '1', index: 0, input: '/show/1/' ] }

 Which means you can get values as:

 params[0] ---- you know index of element
 params.id ---- you know the name of the value


 function handle(params, matched){
    matched.params
    matched.route
    matched.location
 }
 */