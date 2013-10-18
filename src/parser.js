var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var dumpTypes = {
        "geojson": ns.Sosi2GeoJSON,
        "topojson": ns.Sosi2TopoJSON
    };

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new ns.Head(data["HODE"] || data["HODE 0"]);
            this.def = new Def(data["DEF"]); //Not sure if I will care about this
            this.objdef = new Objdef(data["OBJDEF"]); //Not sure if I will care about this
            this.features = new ns.Features(
                _.omit(data, ["HODE", "HODE 0", "DEF", "OBJDEF", "SLUTT"]),
                this.hode
            );
        },

        dumps: function (format) {
            if (dumpTypes[format]) {
                return new dumpTypes[format](this).dumps(_.rest(arguments));
            }
            throw new Error("Outputformat " + format + " is not supported!");
        }
    });

    function splitOnNewline(data) {
        return _.map(data.split("\n"), function (line) {
            if (line.indexOf("!") !== 0) { //ignore comments starting with ! also in the middle of the line
                line = line.split("!")[0];
            }
            return line.replace(/^\s+|\s+$/g, ''); // trim whitespace padding comments and elsewhere
        });
    }

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            return new SosiData(ns.util.parseTree(splitOnNewline(data), 1));
        }
    });
}(SOSI));
