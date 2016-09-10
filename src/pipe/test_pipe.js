import {Pipe} from "../pipe";

//// Testing


let pipeline;

pipeline = [
    Iamnotgoingtousethis => console.log("hello world")
];

pipeline = [
    _      => "hello",
    a_word => a_word + " ",
    a_word => a_word + "world"
];

// But couldn't i just use array reduce on this? what's the point
// a) you don't have to write the reduction yourself
// b) what if there's a promise?


/// but what if one of these values above is a promise?
// you'd have to write something like this
new Promise((resolve, reject) => {
    resolve("hello")
}).then(a_word => a_wrd + " ")
  .then(a_word => a_word + "world");

/*
You have to break out of the logic to handle promises; or callbacks or whatever your function requires.

Lots of people just don't do this; when they start using promises; they use it everywhere b/c at least if gives a
 consistent api surface .




 */
pipeline = [
  number => number * 10
];

// Pipe(pipeline).execute(10); // return 100


// you saw the okay/fail and thought it must be some weird part of the language like a DSL.
// nope... if a thing returns a string
// then the next thing is an object, it'll act as a switch statement
// you can also return [key, value] and it'll pass on value to the pipes of that key
pipeline = [
    number => number == 10 ? 'ok' : 'fail',
    {
        ok: [
          _ => "number is ten"
        ],
        fail: [
          _ => "number is not ten"
        ]
    }
    //,[1,2,3,4] // this will result in an error unless removed.
];

// We want debugging messages
const example = Pipe(pipeline, {verbosity: 3});

let response = example.process(Promise.resolve(10));


response.then((value) => {
    console.log("Pipe Value is.... ");
    console.dir(value, {color: true, depth: 3});
}).catch(err => {
   console.log(err);
});




//describe("pipe", _ => {
//    descripe("hello world", _ => {
//        it('should return hello world',_ => {
//
//            expect(Pipe([
//              _ => "hello world"
//            ], true)).to.equal("hello world");
//
//            expect(Pipe([
//              _ => "hello",
//              word => word + " ",
//              word => word + "world"
//            ], true)).to.equal("hello world");
//
//            expect(Pipe([
//              _ => "hello",
//              word => word + " ",
//              word => word + "world"
//            ], true)).to.equal("hello world");
//
//
//        })
//    })
//})
//


// Error states


// Passed an array
//pipeline = [
//    number => number == 10 ? 'ok' : 'fail',
//    {
//        ok: [
//          _ => "number is ten"
//        ],
//        fail: [
//          _ => "number is not ten"
//        ]
//    },[1,2,3,4] // this will result in an error unless removed.
//];

// Trying to run the Pipe twice;
//
//let response = example.process(Promise.resolve(10));
//example.process(5); // step 0
//
//response.then((value) => {
//    example.process(5); // step 2
//    console.log("Pipe Value is.... ");
//    console.dir(value, {color: true, depth: 3});
//}).catch(err => {
//   console.log(err);
//});

