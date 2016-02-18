'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('./Point');

var LineString = Base.extend({
    initialize: function (lines, origo, unit) {
        this.kurve = _.compact(_.map(lines, function (line) {
            if (line.indexOf('NØ') === -1) {
                return new Point(line, origo, unit);
            }
        }));

        this.knutepunkter = _.filter(this.kurve, function (punkt) {
            return punkt.has_tiepoint;
        });
    }
});

module.exports = LineString;
