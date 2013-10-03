var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({
        initialize: function (lines, origo, unit) {
            var coords = lines[0].split(" ");
            this.y = (parseInt(coords[0], 10) * unit) + origo.y;
            this.x = (parseInt(coords[1], 10) * unit) + origo.x;
        }
    });

}(SOSI));