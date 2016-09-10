export const capitalize_first = (a_string) => {
    return a_string.charAt(0).toUpperCase() + a_string.slice(1);
};


export function capitalize_words(text)  {
    return text.replace(/\w\S*/g, (word) => {
        let [first_letter, rest] = [word.charAt(0), word.substr(1)];
        return first_letter.toUpperCase() + rest.toLowerCase();
    });
}

export function slugify (text){
    return text.replace(/[^\w\s]+/ig, '').replace(/\s+/gi, "-").toLowerCase();
}

export const is_alphanumeric = text => /^[a-z0-9]+$/i.test(text);


/**
 * Removes indentation from multiline strings. Works with both tabs and spaces.
 * This lets you write multiline strings in javascript, ignoring the primary indentation.
 *
 * E.g.
 *      > let x = dedent`
             Line #1
             Line #2
             Line #3
             `)
        > x = 'Line #1\n\tLine #2\n\t\tLine #3';
 *
 * @param templateStrings
 * @returns {string}
 */
export function dedent(templateStrings)  {
    /*
    Copyright (c) 2015 Martin Kolárik

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    Taken Aug 19th, 2016 from: https://github.com/MartinKolarik/dedent-js
     */
    let matches = [];
    let strings = typeof templateStrings === 'string' ? [templateStrings] : templateStrings.slice();

    // 1. Remove trailing whitespace.
    strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, '');

    // 2. Find all line breaks to determine the highest common indentation level.
    for (let i = 0; i < strings.length; i++) {
        let match;

        if (match = strings[i].match(/\n[\t ]+/g)) {
            matches.push(...match);
        }
    }

    // 3. Remove the common indentation from all strings.
    if (matches.length) {
        let size    = Math.min(...matches.map(value => value.length - 1));
        let pattern = new RegExp(`\n[\t ]{${size}}`, 'g');

        for (let i = 0; i < strings.length; i++) {
            strings[i] = strings[i].replace(pattern, '\n');
        }
    }

    // 4. Remove leading whitespace.
    strings[0] = strings[0].replace(/^\r?\n/, '');

    // 5. Join strings with newlines
    return strings.join("\n");
}