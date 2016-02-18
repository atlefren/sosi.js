'use strict';

var _ = require('underscore');

function isEmpty(line) {
    return line === '';
}

function isParent(line, parentLevel) {
    return (countStartingDots(line) === parentLevel);
}

function cleanupLine(line) {
    if (line.indexOf('!') !== -1) {
        line = line.substring(0, line.indexOf('!'));
    }
    return line.replace(/\s+$/, '');
}

function getKeyFromLine(line) {
    if (line.indexOf(':') !== -1) {
        return _.first(line.split(':')).trim();
    }
    return _.first(line.split(' ')).trim();
}

function getNumDots(num) {
    return new Array(num + 1).join('.');
}

function getKey(line, parentLevel) {
    return cleanupLine(
        getKeyFromLine(
            line.replace(getNumDots(parentLevel), '')
        )
    );
}

function countStartingDots(str) {
    var differs = _.find(str, function (character) {return (character !== '.'); });
    if (differs) {
        str = str.substr(0, _.indexOf(str, differs));
    }
    if (_.every(str, function (character) { return (character === '.'); })) {
        return str.length;
    }
    return 0;
}

function getValues(line) {
    return _.rest(line.split(' ')).join(' ').trim();
}

function pushOrCreate(dict, val) {
    if (!_.isArray(dict.objects[dict.key])) {
        dict.objects[dict.key] = [];
    }
    dict.objects[dict.key].push(val);
}

function parseTree(data, parentLevel) {
    return _.reduce(_.reject(data, isEmpty), function (res, line) {
        line = cleanupLine(line);
        if (isParent(line, parentLevel)) {
            res.key = getKey(line, parentLevel);
            line = getValues(line);
        }
        if (!isEmpty(line)) {
            pushOrCreate(res, line);
        }
        return res;
    }, {objects: {}}).objects;
}

module.exports = parseTree;
