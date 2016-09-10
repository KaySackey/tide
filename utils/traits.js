/**
 Usage
     Use will add the functions of `trait_class` onto `target`, and bind them to `target`.

 Usage via ES6

     First. Define a trait as a class possessing static properties.

     class Trait{
         static display()  { return this.name + " in the world" };
     }

     Then define your ES6 class.

     class A {
         constructor(){
            use(this, Trait);
            this.name = "A"
         }
     }

 ---- Then ---

    > let a = new A();
    > console.log(a.display)
    > world

 Use will take any valid javascript object so you can use this w/o defining a class.
 Example:
    trait = {
        display: function() { return "world" }
    }

    use(this, trait)

 * @param {object} target
 * @param {object} trait_class
 */
export function use(target, trait_class) {
    let props = function_props(trait_class);
	  for(let prop of props){
		    Object.defineProperty(target, prop.name, prop.descriptor);
		    target[prop.name].bind(target);
    }
}


/* todo:
    static traits = [
        use(BasicEventHandler, {
            only: ["trigger", "handleEvents"],
            rename: ["trigger", "myTrigger"],
            not: ["someMethod"]
        }),
        use(BasicEventHandler)
    ];

 */



/*
    Return a list of properties on a class that are also functions
*/
const function_props = (prototype) => {
    let arr = [];

    let properties = Object.getOwnPropertyDescriptors(prototype);

    for (var name in properties) {
        let descriptor        = properties[name];
        let is_not_computed   = descriptor.get !== undefined || descriptor.set == undefined;
        let is_function       = descriptor.value instanceof Function;
        if (is_function && is_not_computed) {
            arr.push({name: name, descriptor: descriptor});
        }
    }

    return arr;
};

