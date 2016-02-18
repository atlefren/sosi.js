'use strict';
var _ = require('underscore');
var parseTree = require('./parseTree');
var getLongname = require('./getLongname');
var datatypes = require('./datatypes');
var setDataType = require('./setDataType');


function parseSubdict(lines) {
    return _.reduce(parseTree(lines, 3), function (subdict, value, key) {
        subdict[getLongname(key)] = setDataType(key, value[0]);
        return subdict;
    }, {});
}


var parseFromLevel2 = function (data) {
    return _.reduce(parseTree(data, 2), function (dict, lines, key) {
        if (lines.length) {
            if (lines[0][0] === '.') {
                dict[getLongname(key)] = parseSubdict(lines);
            } else if (lines.length > 1) {
                dict[getLongname(key)] = _.map(lines, function (value) {
                    return setDataType(key, value);
                });
            } else {
                dict[getLongname(key)] = setDataType(key, lines[0]);
            }
        }
        return dict;
    }, {});
};
module.exports = parseFromLevel2;
