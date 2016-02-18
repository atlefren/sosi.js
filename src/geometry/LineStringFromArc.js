'use strict';
var _ = require('underscore');
var Point = require('./Point');
var LineString = require('./LineString');

function cleanLines(lines) {
    return _.filter(lines, function (line) {
        return (line.indexOf('NØ') === -1);
    });
}

var LineStringFromArc = LineString.extend({ // BUEP - an arc defined by three points on a circle
    initialize: function (lines, origo, unit) {
        var p = _.map(cleanLines(lines), function (coord) {
            return new Point(coord, origo, unit);
        });
        if (p.length !== 3) {
            throw new Error('BUEP er ikke definert med 3 punkter');
        }
        // in order to copy & paste my own formulas, we use the same variable names
        var e1 = p[0].x, e2 = p[1].x, e3 = p[2].x;
        var n1 = p[0].y, n2 = p[1].y, n3 = p[2].y;

        // helper constants
        var p12  = (e1 * e1 - e2 * e2 + n1 * n1 - n2 * n2) / 2.0;
        var p13  = (e1 * e1 - e3 * e3 + n1 * n1 - n3 * n3) / 2.0;

        var dE12 = e1 - e2,
            dE13 = e1 - e3,
            dN12 = n1 - n2,
            dN13 = n1 - n3;

        // center of the circle
        var cE = (dN13 * p12 - dN12 * p13) / (dE12 * dN13 - dN12 * dE13);
        var cN = (dE13 * p12 - dE12 * p13) / (dN12 * dE13 - dE12 * dN13);

        // radius of the circle
        var r = Math.sqrt(Math.pow(e1 - cE, 2) + Math.pow(n1 - cN, 2));

        /* angles of points A and B (1 and 3) */
        var th1 = Math.atan2(n1 - cN, e1 - cE);
        var th3 = Math.atan2(n3 - cN, e3 - cE);

        /* interpolation step in radians */
        var dth = th3 - th1;
        if (dth < 0) {
            dth  += 2 * Math.PI;
        }
        if (dth > Math.PI) {
            dth = -2 * Math.PI + dth;
        }
        var npt = Math.floor(32 * dth / 2 * Math.PI);
        if (npt < 0) {
            npt = -npt;
        }
        if (npt < 3) {
            npt = 3;
        }

        dth = dth / (npt - 1);

        this.kurve = _.map(_.range(npt), function (i) {
            var x  = cE + r * Math.cos(th1 + dth * i);
            var y = cN + r * Math.sin(th1 + dth * i);
            if (isNaN(x)) {
                throw new Error('BUEP: Interpolated ' + x + ' for point ' + i + ' of ' + npt + ' in curve.');
            }
            return new Point(x, y);
        });

        this.knutepunkter = _.filter(p, function (point) {
            return point.has_tiepoint;
        });
    }
});


module.exports = LineStringFromArc;
