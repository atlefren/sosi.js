var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function parseLine(line) {
        var res = line.split(" ");
        var data = {};
        data[res.shift()] = res.join(" ");
        return data;
    }

    function getString (data, key) {
        var string = data[key];
        return string.replace(/"/g, "");
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

    var qualityShorthand = [
        "maalemetode",
        "noyaktighet",
        "synbarhet",
        "h-maalemetode",
        "h-noyaktighet",
        "max-avvik"
        ];

    function parseQuality(data) {
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

    var Head = ns.Base.extend({
        initialize: function (data) {
            this.setData(data);
        },

        parse: function (data) {
            var parent;
            var immediate = _.reduce(data, function (res, line) {
                var s = line;
                if (s.indexOf('!') !== -1) {
                    s = s.substring(0, s.indexOf('!'))
                }
                line = s.replace(/\s\s*$/, '');
                if (numDots(line) === 2) {
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
                        var val = parseLine(line.replace("...", ""));
                        _.extend(arr, val);
                        return arr;
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

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var Data = ns.Base.extend({
        initialize: function (elements) {
            this.elements = elements;
        },

        length: function () {
            return _.keys(this.elements).length;
        }

    });

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new Head(data["HODE"]);
            this.def = new Def(data["DEF"]);
            this.objdef = new Objdef(data["OBJDEF"]);
            this.data = new Data(_.omit(data, ["HODE", "DEF", "OBJDEF", "SLUTT"]));
        }
    });

    function numDots(str) {
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

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            var parent;
            var res =_.reduce(data.split("\n"), function (res, line) {
                if (line[0] && line[0] !== "!") {
                    if (numDots(line) === 1) {
                        var s = line.replace(".", "");
                        var key = s.substring(0, s.indexOf('!')).replace(/\s\s*$/, '');
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