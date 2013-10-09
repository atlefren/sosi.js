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
            this.hode = new ns.Head(data["HODE"]);
            this.def = new Def(data["DEF"]); //Not sure if I will care about this
            this.objdef = new Objdef(data["OBJDEF"]); //Not sure if I will care about this
            this.features = new ns.Features(
                _.omit(data, ["HODE", "DEF", "OBJDEF", "SLUTT"]),
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

    function isParent(line) {
        return (ns.util.countStartingDots(line) === 1);
    }

    function isComment(line) {
        return !(line[0] && line[0] !== "!");
    }

    function splitOnNewline(data) {
        return data.split("\n");
    }

    function getKey(line) {
        return ns.util.cleanupLine(line.replace(".", ""));
    }

    function pushOrCreate(dict, val) {
        if (!_.isArray(dict.objects[dict.key])) {
            dict.objects[dict.key] = [];
        }
        dict.objects[dict.key].push(val);
    }

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            var res = _.reduce(_.reject(splitOnNewline(data), isComment), function (res, line) {
                if (isParent(line)) {
                    res.key = getKey(line);
                } else {
                    pushOrCreate(res, line);
                }
                return res;
            }, {objects: {}});
            return new SosiData(res.objects);
        }
    });
}(SOSI));