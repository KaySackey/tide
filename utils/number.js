
// Returns a random number between min (inclusive) and max (exclusive)
export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
export function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//
///**
// * Create a number range from begin to end, at the following intervals
// * @param begin
// * @param end
// * @param interval
// * @return Array
// */
//
//export function range(begin, end, interval = 1) {
//    return Array.from(iter_range(begin, end, interval))
//}
//
///**
// * Create a number range from begin (inclusive) to end (inclusive), at the following intervals
// * @param begin
// * @param end
// * @param interval
// *
// * Returns an iterator
// */
//export function* iter_range (begin, end, interval = 1) {
//    for (let i = begin; i <= end; i += interval) {
//        yield i;
//    }
//}