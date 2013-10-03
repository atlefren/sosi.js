var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({
        initialize: function (line, origo, unit) {
            if (_.isArray(line)) {
                line = line[1];
            }
            var coords = line.split(" ");
            this.y = (parseInt(coords[0], 10) * unit) + origo.y;
            this.x = (parseInt(coords[1], 10) * unit) + origo.x;
        }
    });

    ns.LineString = ns.Base.extend({
        initialize: function (lines, origo, unit) {
            this.kurve = _.compact(_.map(lines, function (line) {
                if (line !==  "NØ") {
                    return new ns.Point(line, origo, unit);
                }
            }));
        }
    });

}(SOSI));