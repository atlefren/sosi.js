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

            this.y = ns.util.round((parseInt(coords[0], 10) * unit) + origo.y, 2);
            this.x = ns.util.round((parseInt(coords[1], 10) * unit) + origo.x, 2);

            if (coords[2] && !isNaN(coords[2])) {
                    this.z = parseInt(parseInt(coords[1], 10) * unit)
            }

            if (line.indexOf(".KP") !== -1) {
                this.setKnutepunkt(line.substring(line.indexOf(".KP"), line.length).split(" ")[1]);
            }
        },

        setKnutepunkt: function (kode) {
            this.knutepunkt = true;
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
                return punkt.knutepunkt;
            })
        }
    });

    ns.Polygon = ns.Base.extend({
        initialize: function (refs, features) {

            refs = refs.replace(/:/g, "").split(" ");

            this.flate = _.flatten(_.map(refs, function(ref) {
                ref = parseInt(ref);
                var id= Math.abs(ref);
                var kurve = features.getById(id);
                if (!kurve) {
                    throw new Error("Fant ikke KURVE " + id +" for FLATE");
                }

                var geom = kurve.geometry.kurve;
                if(ref < 0) {
                    geom =  geom.reverse();
                }
                return _.initial(geom);
            }));
            this.flate.push(this.flate[0]);
        }
    });

}(SOSI));