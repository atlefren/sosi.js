var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var dumpTypes = {
        "geojson": ns.Sosi2GeoJSON
    };

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new ns.Head(data["HODE"]);
            this.def = new Def(data["DEF"]); //Not sure if I will care about this
            this.objdef = new Objdef(data["OBJDEF"]); //Not sure if I will care about this
            this.features = new ns.Features(
                _.omit(data, ["HODE", "DEF", "OBJDEF", "SLUTT"]),
                this.hode
            );
        },

        dumps: function(format) {
            if (dumpTypes[format]) {
                return new dumpTypes[format](this).dumps();
            }
            throw new Error("Outputformat " + format + " is not supported!");
        }
    });

    function isParent(line) {
        return (ns.util.countStartingDots(line) === 1);
    }

    function isComment(line) {
        return !(line[0] && line[0] !== "!");
    }

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            var parent;
            var res =_.reduce(data.split("\n"), function (res, line) {
                if (!isComment(line)) {
                    if (isParent(line)) {
                        var key = ns.util.cleanupLine(line.replace(".", ""));
                        res[key] = [];
                        parent = key;
                    } else if(parent){
                        res[parent].push(line);
                    }
                }
                return res;
            }, {});
            return new SosiData(res);
        }
    });
}(SOSI));