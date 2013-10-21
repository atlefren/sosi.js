var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({

        knutepunkt: false,

        initialize: function (line, origo, unit) {
            if (_.isNumber(line)) { /* initialized directly with x and y */
                this.x = line;
                this.y = origo;
                return;
            }

            if (_.isArray(line)) {
                line = line[1];
            }

            var coords = line.split(/\s+/);

            var numDecimals = 0;
            if (unit < 1) {
                numDecimals = -Math.floor(Math.log(unit) / Math.LN10);
            }

            this.y = ns.util.round((parseInt(coords[0], 10) * unit) + origo.y, numDecimals);
            this.x = ns.util.round((parseInt(coords[1], 10) * unit) + origo.x, numDecimals);

            if (coords[2] && !isNaN(coords[2])) {
                this.z = ns.util.round(parseInt(coords[2], 10) * unit, numDecimals);
            }

            if (line.indexOf(".KP") !== -1) {
                this.setTiepoint(
                    line.substring(line.indexOf(".KP"), line.length).split(" ")[1]
                );
            }
        },

        setTiepoint: function (kode) {
            this.has_tiepoint = true;
            this.knutepunktkode = parseInt(kode, 10);
        }
    });


    function cleanLines(lines) {
        return _.filter(lines, function (line) {
            return (line.indexOf("NØ") === -1);
        });
    }

    ns.LineStringFromArc = ns.Base.extend({ // BUEP - an arc defined by three points on a circle
        initialize: function (lines, origo, unit) {
            var p = _.map(cleanLines(lines), function (coord) {
                return new ns.Point(coord, origo, unit);
            });
            if (p.length !== 3) {
                throw new Error("BUEP er ikke definert med 3 punkter");
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
                    throw new Error("BUEP: Interpolated " + x + " for point " + i + " of " + npt + " in curve.");
                }
                return new ns.Point(x, y);
            });

            this.knutepunkter = _.filter(p, function (point) {
                return point.has_tiepoint;
            });
        }
    });

    ns.LineString = ns.Base.extend({
        initialize: function (lines, origo, unit) {
            this.kurve = _.compact(_.map(lines, function (line) {
                if (line.indexOf("NØ") === -1) {
                    return new ns.Point(line, origo, unit);
                }
            }));

            this.knutepunkter = _.filter(this.kurve, function (punkt) {
                return punkt.has_tiepoint;
            });
        }
    });

    function createPolygon(refs, features) {
        var flate =  _.flatten(_.map(refs, function (ref) {
            var id = Math.abs(ref);
            var kurve = features.getById(id);
            if (!kurve) {
                throw new Error("Fant ikke KURVE " + id + " for FLATE");
            }
            var geom = kurve.geometry.kurve;
            if (ref < 0) {
                geom = _.clone(geom).reverse();
            }
            return _.initial(geom);
        }));
        flate.push(flate[0]);
        return flate;
    }

    function parseRefs(refs) {
        return _.map(refs.trim().split(" "), function (ref) {
            return parseInt(ref.replace(":", ""), 10);
        });
    }

    ns.Polygon = ns.Base.extend({
        initialize: function (refs, features) {
            var shell = refs;
            var holes = [];
            var index = refs.indexOf("(");
            if (index !== -1) {
                shell = refs.substr(0, index);
                holes = refs.substr(index, refs.length);
            }

            shell = parseRefs(shell);
            holes = _.map(
                _.reduce(holes, function (result, character) {
                    if (character === "(") {
                        result.push("");
                    } else if (character !== ")" && character !== "") {
                        result[result.length - 1] += character;
                    }
                    return result;
                }, []),
                parseRefs
            );

            this.flate = createPolygon(shell, features);

            this.holes = _.map(holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(Math.abs(hole[0]));
                    if (feature.geometryType === "FLATE") {
                        return feature.geometry.flate;
                    }
                }
                return createPolygon(hole, features);
            });
            this.shellRefs = shell;
            this.holeRefs = holes;
        }
    });
}(SOSI));
