'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var roundToDecimals = require('../util/round');
var proj4 = require('proj4');

var Point = Base.extend({

    knutepunkt: false,

    initialize: function (line, origo, unit, srs) {
        if (_.isNumber(line)) { /* initialized directly with x and y */
            this.x = line;
            this.y = origo;
            this.srs = unit;
            return;
        }
        this.srs = srs;

        if (_.isArray(line)) {
            line = line[1];
        }

        var coords = line.split(/\s+/);

        var numDecimals = 0;
        if (unit < 1) {
            numDecimals = -Math.floor(Math.log(unit) / Math.LN10);
        }

        this.y = roundToDecimals((parseInt(coords[0], 10) * unit) + origo.y, numDecimals);
        this.x = roundToDecimals((parseInt(coords[1], 10) * unit) + origo.x, numDecimals);

        if (coords[2] && !isNaN(coords[2])) {
            this.z = roundToDecimals(parseInt(coords[2], 10) * unit, numDecimals);
        }

        if (line.indexOf('.KP') !== -1) {
            this.setTiepoint(
                line.substring(line.indexOf('.KP'), line.length).split(' ')[1]
            );
        }
    },

    transform: function (to) {
        if (to === this.srs) {
            return this;
        }
        var transformed = proj4(this.srs, to, [this.x, this.y]);
        this.x = transformed[0];
        this.y = transformed[1];
        this.srs = to;
        return this;
    },

    setTiepoint: function (kode) {
        this.has_tiepoint = true;
        this.knutepunktkode = parseInt(kode, 10);
    }
});

module.exports = Point;
