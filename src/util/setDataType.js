'use strict';
var _ = require('underscore');
var datatypes = require('./datatypes');

function setDataType(key, value) {

    if (!datatypes) {
        return value;
    }

    var type = _.isArray(key) ? key : datatypes[key];
    if (type) {
        if (!_.isObject(type[0])) {
            if (type[1] === 'Integer') {
                return parseInt(value, 10);
            } else if (type[1] === 'Real') {
                return parseFloat(value);
            } else if (type[1] === 'Date') {
                if (value.length === 8) {
                    return new Date(
                        parseInt(value.substring(0, 4), 10),
                        parseInt(value.substring(4, 6), 10) - 1,
                        parseInt(value.substring(6, 8), 10)
                    );
                } else if (value.length === 14) {
                    return new Date(
                        parseInt(value.substring(0, 4), 10),
                        parseInt(value.substring(4, 6), 10) - 1,
                        parseInt(value.substring(6, 8), 10),
                        parseInt(value.substring(8, 10), 10),
                        parseInt(value.substring(10, 12), 10),
                        parseInt(value.substring(12, 14), 10)
                    );
                }
            } else if (_.isString(type[1])) {
                if (value[0] === '"' || value[0] === '\'') {
                    return value.substring(1, value.length - 1);
                }
                return value;
            }
        }
    }
    return value;
}

module.exports = setDataType;
