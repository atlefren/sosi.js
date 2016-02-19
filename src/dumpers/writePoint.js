'use strict';
var _ = require('underscore');

function writePoint(point) {
    var p = [point.x, point.y];
    if (_.has(point, 'z')) {
        p.push(point.z);
    }
    return p;
}

module.exports = writePoint;
