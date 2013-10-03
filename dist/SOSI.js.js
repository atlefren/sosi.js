var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Base = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(ns.Base.prototype, {
        initialize: function () {}
    });

    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }
            _.extend(child, parent, staticProps);
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
            if (protoProps) _.extend(child.prototype, protoProps);
        child.__super__ = parent.prototype;

        return child;
    };

    ns.Base.extend = extend;
}(SOSI));;var SOSI = window.SOSI || {};

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



;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function parseLine(line) {
        var res = line.split(" ");
        var data = {};
        data[res.shift()] = res.join(" ");
        return data;
    }

    function getString (data, key) {
        return data[key].replace(/"/g, "");
    }

    function getNumber (data, key) {
        return parseFloat(data[key]);
    }

    function getSrid(koordsys) {
        koordsys = parseInt(koordsys);
        if (ns.koordsysMap[koordsys]) {
            return ns.koordsysMap[koordsys];
        }
        throw new Error("KOORDSYS = " + koordsys + " not found!");
    }

    function parseQuality(data) {

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

    function parseBbox(data) {
        var ll = data["MIN-NØ"].split(" ");
        var ur = data["MAX-NØ"].split(" ");
        return [
            parseFloat(ll[1]),
            parseFloat(ll[0]),
            parseFloat(ur[1]),
            parseFloat(ur[0])
        ];
    }

    function parseOrigo(data) {
        data = data.split(" ");
        return {
            "x": parseFloat(data[1]),
            "y": parseFloat(data[0])
        };
    }

    ns.Head = ns.Base.extend({
        initialize: function (data) {
            this.setData(data);
        },

        parse: function (data) {
            var parent;
            var immediate = _.reduce(data, function (res, line) {
                line = ns.util.cleanupLine(line);
                if (ns.util.countStartingDots(line) === 2) {
                    line = line.replace("..", "");
                    if (line.split(" ").length === 1) {
                        res[line] = [];
                        parent = line;
                    } else {
                        _.extend(res, parseLine(line));
                    }
                }
                else {
                    res[parent].push(line);
                }
                return res;
            }, {});
            return _.reduce(immediate, function (res, value, key) {
                if (_.isArray(value)) {
                    res[key] = _.reduce(value, function (arr, line) {
                        return _.extend(arr, parseLine(line.replace("...", "")));
                    },{});
                } else {
                    res[key] = value;
                }

                return res;
            }, {});
        },

        setData: function (data) {
            data = this.parse(data);
            this.eier = getString(data, "EIER");
            this.produsent = getString(data, "PRODUSENT");
            this.objektkatalog = getString(data, "OBJEKTKATALOG");
            this.verifiseringsdato = getString(data, "VERIFISERINGSDATO");
            this.version = getNumber(data, "SOSI-VERSJON");
            this.level = getNumber(data, "SOSI-NIVÅ");
            this.kvalitet = parseQuality(data["KVALITET"]);
            this.bbox = parseBbox(data["OMRÅDE"]);
            this.origo = parseOrigo(data["TRANSPAR"]["ORIGO-NØ"]);
            this.enhet = parseFloat(data["TRANSPAR"]["ENHET"]);
            this.vertdatum = getString(data["TRANSPAR"], "VERT-DATUM");
            this.srid = getSrid(data["TRANSPAR"]["KOORDSYS"]);
        }
    });

}(SOSI));;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({
        initialize: function (lines, origo, unit) {
            var coords = lines[0].split(" ");
            this.y = (parseInt(coords[0], 10) * unit) + origo.y;
            this.x = (parseInt(coords[1], 10) * unit) + origo.x;
        }
    });

}(SOSI));;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function createGeometry (geometryType, lines, origo, unit) {

        var geometryTypes = {
            "PUNKT": ns.Point
        };

        if (!geometryTypes[geometryType]) {
            //throw new Error("GeometryType " + geometryType + " is not handled (yet..?)");
            return null;
        }
        return new geometryTypes[geometryType](lines, origo, unit);
    }

    ns.Feature = ns.Base.extend({

        initialize: function (data, origo, unit) {
            if (! data.id) {
                throw new Error("Feature must have ID!");
            }
            this.id = data.id;
            this.parseData(data, origo, unit);
        },

        parseData: function (data, origo, unit) {

            var foundGeom = false;
            var parsed = _.reduce(data.lines, function (result, line){
                line = ns.util.cleanupLine(line).replace("..", "");
                if (line === "NØ") {
                    foundGeom = true;
                } else if (!foundGeom) {
                    result.attributes.push(line);
                } else {
                    result.geometry.push(line);
                }
                return result;
            }, {"attributes": [], "geometry": []});


            this.attributes = _.reduce(parsed.attributes, function (attributes, line) {
                line = line.split(" ");
                attributes[line.shift()] = line.join(" ");
                return attributes;
            }, {});

            this.geometry = createGeometry(data.geometryType, parsed.geometry, origo, unit);
        }
    });

    ns.Features = ns.Base.extend({

        initialize: function (elements, hode) {
            this.hode = hode;
            this.features = _.map(elements, function (value, key) {
                key = key.replace(":", "").split(" ");
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: value
                };
                return new ns.Feature(data, hode.origo, hode.enhet);
            });
        },

        length: function () {
            return this.features.length;
        },

        at: function (idx) {
            return this.features[idx];
        }
    });

}(SOSI));;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new ns.Head(data["HODE"]);
            this.def = new Def(data["DEF"]); //Not sure if I will care about this
            this.objdef = new Objdef(data["OBJDEF"]); //Not sure if I will care about this
            this.features = new ns.Features(
                _.omit(data, ["HODE", "DEF", "OBJDEF", "SLUTT"]),
                this.hode
            );
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