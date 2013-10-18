var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({

        knutepunkt: false,

        initialize: function (line, origo, unit) {
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
