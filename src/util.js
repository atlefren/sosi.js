var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.util = {
        cleanupLine: function (line) {
            if (line.indexOf('!') !== -1) {
                line = line.substring(0, line.indexOf('!'));
            }
            return line.replace(/\s\s*$/, '');
        },

        countStartingDots: function (str) {
            var stop = false;
            return _.reduce(str, function (count, character) {
                if (character === "." && !stop) {
                    count += 1;
                } else {
                    stop = true;
                }
                return count;
            }, 0);
        },

        parseQuality: function (data) {

            if (!data) {
                return null;
            }

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
        },

        round: function (number, numDecimals) {
            var pow = Math.pow(10, numDecimals);
            return Math.round(number * pow) / pow;
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
        9: "EPSG:4273",
        21: "EPSG:32631",
        22: "EPSG:32632",
        23: "EPSG:32633",
        24: "EPSG:32634",
        25: "EPSG:32635",
        26: "EPSG:32636"
        //31 UTM-Sone 31 ED50 UTM 31
        //32 UTM-Sone 32 ED50 UTM 32
        //33 UTM-Sone 33 ED50 UTM 33
        //34 UTM-Sone 34 ED50 UTM 34
        //35 UTM-Sone 35 ED50 UTM 35
        //36 UTM-Sone 36 ED50 UTM 36
        //41 Lokalnett, uspes.
        //42 Lokalnett, uspes.
        //50 ED50 Geografisk ED50 Ingen Ingen
        //51 NGO-56A (Møre) NGO1948 Gauss-Krüger
        //52 NGO-56B (Møre) NGO1948 Gauss-Krüger
        //53 NGO-64A (Møre) NGO1948 Gauss-Krüger
        //54 NGO-64B (Møre) NGO1948 Gauss-Krüger
        //72 WGS72 Geografisk WGS72 Ingen Ingen
        //84 WGS84 Geografisk WGS84 Ingen Ingen
        //87 ED87 Geografisk ED87 Ingen Ingen
        //99 Egendefinert *
        //101 Lokalnett, Oslo
        //102 Lokalnett, Bærum
        //103 Lokalnett, Asker
        //104 Lokalnett, Lillehammer
        //105 Lokalnett,Drammen
        //106 Lokalnett, Bergen / Askøy
    };

}(SOSI));



