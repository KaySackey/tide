export const consoleJSON = (object, depth, delimiter) => {
    /**

     The MIT License

     Copyright (c) 2015 Michael Deal

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
     */
    depth     = depth || 7;
    delimiter = delimiter || '\t';

    const template = {
        'background': 'background: #1B2B34;', // dark-blue
        'default'   : 'color: #CDD3DE;', // gray
        'string'    : 'color: #99C794;', // green
        'boolean'   : 'color: #6699CC;', // blue
        'function'  : 'color: #EC5f67;', // red
        'number'    : 'color: #FAC863;', // yellow
        'null'      : 'color: #F99157;', // orange
        'undefined' : 'color: #C594C5;', // purple
        'overflow'  : 'color: #EC5f67;' // red
    };

    function log(indent, type, arg1, arg2, arg3) {
        const background   = `${template.background}; padding: 3px 0;`;
        const paddingRight = 'padding-right: 10px;';
        const stylePrefix  = template['default'] + background;
        const styleSuffix  = template['default'] + background + paddingRight;
        let color;
        switch (type) {
            case 'default':
            case 'overflow':
                color = template[type];
                console.log(`%c${indent}${arg1}%c`, color + background, styleSuffix);
                return;
            case 'string':
                color = template[type];
                arg2  = `"${arg2}"`;
                break;
            case 'object':
                color = template['null'];
                break;
            case 'function':
                color = template[type];
                arg2  = 'function(){},';
                break;
            default:
                color = template[type];
                break;
        }
        ///
        if ( typeof arg2 === 'undefined' ) arg2 = 'undefined';
        if ( typeof arg3 === 'undefined' ) arg3 = '';
        ///
        console.log(
          `%c${indent}${arg1}%c${arg2}%c${arg3}`,
          stylePrefix, color + background, styleSuffix
        );
    }

    function processObject(data, _indent) {
        const indent   = _indent + delimiter;
        const is_array = Array.isArray(data);
        const suffix   = is_array ? ']' : '}';
        ///
        if ( _indent.length / delimiter.length === depth ) { // max depth
            log(indent, 'overflow', '...');
            return [_indent, 'default', suffix];
        }
        else {
            var buffer;
            if ( is_array ) {
                for (var idx = 0, length = data.length; idx < length; idx++) {
                    processArg(`${idx}: `, data[idx]);
                }
            }
            else {
                for (let idx in data) {
                    if ( data.hasOwnProperty(idx) ) {
                        processArg(`"${idx}": `, data[idx]);
                    }
                }
            }
            ///
            printBuffer(false);
            ///
            return [_indent, 'default', suffix];
        }

        function processArg(key, value) {
            printBuffer(true);
            ///
            if ( value && typeof value === 'object' ) {
                const suffix = Array.isArray(value) ? '[' : '{';
                log(indent, 'default', key + suffix);
                buffer = processObject(value, indent);
            }
            else {
                buffer = [indent, typeof value, key, value];
            }
        }

        function printBuffer(addComma) {
            if ( buffer ) {
                if ( addComma ) {
                    if ( buffer[1] === 'default' ) {
                        buffer[2] += ',';
                    }
                    else {
                        buffer.push(',');
                    }
                }
                log.apply(null, buffer);
            }
        }
    }

    ///
    log('', 'default', '{');
    log.apply(null, processObject(object, ''));
};


/*** Overrides **/
/**
 * Mostly global_obj will be 'window' in a browser environment
 * @param global_obj
 */
export function monkey_patch(global_obj) {
    global_obj.console.json = consoleJSON;

    // Like console.trace except it prints the object out immediately.
    Object.defineProperty(global_obj.console, 'stack', {
        enumerable  : false,
        configurable: true,
        set         : undefined,
        get         : function () {
            console.debug((new Error).stack);
        }
    });


    console.print_error = function (error) {
        console.error(error.message);
        if ( error.extra ) {
            consoleJSON(error.extra)
        }
    };
}



