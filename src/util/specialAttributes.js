'use strict';
var _ = require('underscore');
var setDataType = require('./setDataType');
var datatypes = require('./datatypes');

function parseSpecial(key, subfields) {
    return function (data) {
        if (!data) {
            return null;
        }
        if (_.isObject(data)) {
            return data; // extended subfields
        }
        if (_.isString(data)) {
            return _.reduce(data.match(/"[^"]*"|'[^']*'|\S+/g), function (res, chunk, i) {
                res[subfields[i][0]] = setDataType(subfields[i], chunk);
                return res;
            }, {});
        }
    };
}

var specialAttributes = (function () {
    if (!!datatypes) {
        return _.reduce(datatypes, function (attrs, type, key) {
            if (_.isObject(type[1])) { // true for complex datatypes
                attrs[type[0]] = {name: type[0], createFunction: parseSpecial(key, type[1])};
            }
            return attrs;
        }, {});
    }
}());

module.exports = specialAttributes;
