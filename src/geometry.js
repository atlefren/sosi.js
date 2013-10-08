var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({

        knutepunkt: false,

        initialize: function (line, origo, unit) {
            if (_.isArray(line)) {
                line = line[1];
            }

            var coords = line.split(" ");

            var numDecimals = 0;
            if (unit < 1) {
                numDecimals = String(unit).split(".")[1].length;
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
                geom =  geom.reverse();
            }
            return _.initial(geom);
        }));
        flate.push(flate[0]);
        return flate;
    }

    ns.Polygon = ns.Base.extend({
        initialize: function (refs, features) {
            var holeIdx = -1;
            refs = _.reduce(refs.replace("( :", "(:").split(" "), function (res, ref) {
                ref = ref.replace(/:/g, "");
                //console.log(ref)
                if (ref.indexOf("(") !== -1) {
                    holeIdx += 1;
                    res.holes.push([]);
                    ref = ref.replace("(", "");
                }
                if (ref.indexOf(")") !== -1) {
                    ref = ref.replace(")", "");
                }
                if (holeIdx === -1) {
                    res.shell.push(parseInt(ref, 10));
                } else {
                    res.holes[holeIdx].push(parseInt(ref, 10));
                }
                return res;
            }, {holes: [], "shell": []});

            this.flate = createPolygon(refs.shell, features);

            this.holes = _.map(refs.holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(Math.abs(hole[0]));
                    if (feature.geometryType === "FLATE") {
                        return feature.geometry.flate;
                    }
                }
                //console.log(hole);
                return createPolygon(hole, features);
            });
        }
    });
}(SOSI));