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
            this.y = (parseInt(coords[0], 10) * unit) + origo.y;
            this.x = (parseInt(coords[1], 10) * unit) + origo.x;

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
                if (line !==  "NØ") {
                    return new ns.Point(line, origo, unit);
                }
            }));

            this.knutepunkter = _.filter(this.kurve, function (punkt) {
                return punkt.knutepunkt;
            })
        }
    });

}(SOSI));