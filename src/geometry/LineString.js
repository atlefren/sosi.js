'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('./Point');

var LineString = Base.extend({
    initialize: function (lines, origo, unit, srs) {
        this.srs = srs;
        this.kurve = _.compact(_.map(lines, function (line) {
            if (line.indexOf('NØ') === -1) {
                return new Point(line, origo, unit, srs);
            }
        }));

        this.knutepunkter = _.filter(this.kurve, function (punkt) {
            return punkt.has_tiepoint;
        });
    },

    transform: function (to) {
        this.kurve = _.map(this.kurve, function (point) {
            return point.transform(to);
        });
        this.srs = to;
        return this;
    }
});

module.exports = LineString;
