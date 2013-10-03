var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.util = {
        cleanupLine: function  (line) {
            if (line.indexOf('!') !== -1) {
                line = line.substring(0, line.indexOf('!'));
            }
            return line.replace(/\s\s*$/, '');
        },

        countStartingDots: function (str) {
            var stop = false;
            return _.reduce(str, function(count, character) {
                if (character === "." && !stop) {
                    count++;
                } else {
                    stop = true;
                }
                return count;
            }, 0)
        },

        parseQuality: function (data) {

            var qualityShorthand = [
                "maalemetode",
                "noyaktighet",
                "synbarhet",
                "h-maalemetode",
                "h-noyaktighet",
                "max-avvik"
            ];

            if (_.isString(data)) {
                return _.reduce(data.split(" "), function (res, number, i) {
                    res[qualityShorthand[i]] = parseInt(number, 10);
                    return res;
                }, {});
            }
            throw new Error("Reading KVALITET as subfields not implemented!");
    }

};

    ns.koordsysMap = {
        1: "EPSG:27391",
        2: "EPSG:27392",
        3: "EPSG:27393",
        4: "EPSG:27394",
        5: "EPSG:27395",
        6: "EPSG:27396",
        7: "EPSG:27397",
        8: "EPSG:27398",
        9: "EPSG:4273"
        //TODO: fill in rest of table from spec
    };

}(SOSI));



