
// Taken from https://github.com/wycats/javascript-decorators
/* Usage

    class Person {
      @memoize
      get name() { return `${this.first} ${this.last}` }
      set name(val) {
        let [first, last] = val.split(' ');
        this.first = first;
        this.last = last;
      }
    }

 */
let memo = new WeakMap();
function memoize(target, name, descriptor) {
  let getter = descriptor.get, setter = descriptor.set;

  descriptor.get = function() {
    let table = memoizationFor(this);
    if (name in table) { return table[name]; }
    return table[name] = getter.call(this);
  };

  descriptor.set = function(val) {
    let table = memoizationFor(this);
    setter.call(this, val);
    table[name] = val;
  };
}

function memoizationFor(obj) {
  let table = memo.get(obj);
  if (!table) { table = Object.create(null); memo.set(obj, table); }
  return table;
}