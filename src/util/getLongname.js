'use strict';

var types = require('./datatypes');

function getLongname(key) { // not tested
    if (types && types[key]) {
        var type = types[key];
        return !!type && type[0] || key; //ambiguity ahoy!
    }
    return key;
}

module.exports = getLongname;
