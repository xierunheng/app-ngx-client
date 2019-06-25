/**
 * The Util service is for thin, globally reusable, utility functions
 */

import {
    isFunction,
    noop,
} from 'lodash';
import { Response } from '@angular/http';

/**
 * Return a callback or noop function
 *
 * @param  {Function|*} cb - a 'potential' function
 * @return {Function}
 */
export function safeCb(cb) {
    return isFunction(cb) ? cb : noop;
}

/**
 * Parse a given url with the use of an anchor element
 *
 * @param  {String} url - the url to parse
 * @return {Object}     - the parsed url, anchor element
 */
export function urlParse(url) {
    var a = document.createElement('a');
    a.href = url;

    // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
    if (a.host === '') {
        a.href = a.href;
    }

    return a;
}

/**
 * Test whether or not a given url is same origin
 *
 * @param  {String}           url       - url to test
 * @param  {String|String[]}  [origins] - additional origins to test against
 * @return {Boolean}                    - true if url is same origin
 */
export function isSameOrigin(url, origins) {
    url = urlParse(url);
    origins = (origins && [].concat(origins)) || [];
    origins = origins.map(urlParse);
    origins.push(window.location);
    origins = origins.filter(function(o) {
        let hostnameCheck = url.hostname === o.hostname;
        let protocolCheck = url.protocol === o.protocol;
        // 2nd part of the special treatment for IE fix (see above):
        // This part is when using well-known ports 80 or 443 with IE,
        // when window.location.port==='' instead of the real port number.
        // Probably the same cause as this IE bug: https://goo.gl/J9hRta
        let portCheck = url.port === o.port || (o.port === '' && (url.port === '80' || url.port === '443'));
        return hostnameCheck && protocolCheck && portCheck;
    });
    return origins.length >= 1;
}

export function extractData(res: Response) {
    if(!res.text()) return {};
    return res.json() || { };
}

/**
 * Extending object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
export const deepExtend = function(...objects: any[]): any {
    if (arguments.length < 1 || typeof arguments[0] !== 'object') {
        return false;
    }

    if (arguments.length < 2) {
        return arguments[0];
    }

    const target = arguments[0];

    // convert arguments to array and cut off target object
    const args = Array.prototype.slice.call(arguments, 1);

    let val, src;

    args.forEach(function(obj: any) {
        // skip argument if it is array or isn't object
        if (typeof obj !== 'object' || Array.isArray(obj)) {
            return;
        }

        Object.keys(obj).forEach(function(key) {
            src = target[key]; // source value
            val = obj[key]; // new value

            // recursion prevention
            if (val === target) {
                return;

                /**
                 * if new value isn't object then just overwrite by new value
                 * instead of extending.
                 */
            } else if (typeof val !== 'object' || val === null) {
                target[key] = val;

                return;

                // just clone arrays (and recursive clone objects inside)
            } else if (Array.isArray(val)) {
                target[key] = deepCloneArray(val);

                return;

                // custom cloning and overwrite for specific objects
            } else if (isSpecificValue(val)) {
                target[key] = cloneSpecificValue(val);

                return;

                // overwrite by new value if source isn't object or array
            } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
                target[key] = deepExtend({}, val);

                return;

                // source value and new value is objects both, extending...
            } else {
                target[key] = deepExtend(src, val);

                return;
            }
        });
    });

    return target;
};

function isSpecificValue(val: any) {
    return (
        val instanceof Date
        || val instanceof RegExp
    ) ? true : false;
}

function cloneSpecificValue(val: any): any {
    if (val instanceof Date) {
        return new Date(val.getTime());
    } else if (val instanceof RegExp) {
        return new RegExp(val);
    } else {
        throw new Error('cloneSpecificValue: Unexpected situation');
    }
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr: any[]): any {
    const clone: any[] = [];
    arr.forEach(function(item: any, index: any) {
        if (typeof item === 'object' && item !== null) {
            if (Array.isArray(item)) {
                clone[index] = deepCloneArray(item);
            } else if (isSpecificValue(item)) {
                clone[index] = cloneSpecificValue(item);
            } else {
                clone[index] = deepExtend({}, item);
            }
        } else {
            clone[index] = item;
        }
    });

    return clone;
}

// getDeepFromObject({result: {data: 1}}, 'result.data', 2); // returns 1
export function getDeepFromObject(object = {}, name: string, defaultValue?: any) {
    const keys = name.split('.');
    // clone the object
    let level = deepExtend({}, object || {});
    keys.forEach((k) => {
        if (level && typeof level[k] !== 'undefined') {
            level = level[k];
        } else {
            level = undefined;
        }
    });

    return typeof level === 'undefined' ? defaultValue : level;
}

export function urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: { break; }
        case 2: { output += '=='; break; }
        case 3: { output += '='; break; }
        default: {
            throw new Error('Illegal base64url string!');
        }
    }
    return b64DecodeUnicode(output);
}

export function b64decode(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output: string = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
        throw new Error(`'atob' failed: The string to be decoded is not correctly encoded.`);
    }

    for (
        // initialize result and counters
        let bc: number = 0, bs: any, buffer: any, idx: number = 0;
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
}

// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
export function b64DecodeUnicode(str: any) {
    return decodeURIComponent(Array.prototype.map.call(b64decode(str), (c: any) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * [从 cur 获取下一个 code, 取最后 5 位数]
 * cur 以 number 作为后缀，该方法以 cur 为基础，把 number 后缀 +1
 * 形成新的 number 包装成 code 返回
 * @param {string} cur [description]
 * @param {number} digit [序号所占的位数]
 */
export function nextCode(cur: string, digit: number = 1) {
  let findNum = cur.match(/[0-9]{digit}$/);
  if(findNum) {
    return findNum.input.substr(0, findNum.index) + (Number(findNum[0]) + 1);
  } else {
    return cur + '_0';
  }
}
