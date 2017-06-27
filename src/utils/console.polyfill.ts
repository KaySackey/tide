// Polyfill for browsers that do not support detailed logging
console.group = console.group || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
console.debug = console.debug || console.log;
console.info = console.info || console.log;
console.error = console.error || console.log;
console.table = console.table || console.log;
console.groupEnd = console.groupEnd || function() {};