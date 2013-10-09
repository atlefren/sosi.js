var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function parseLine(line) {
        var res = line.split(" ");
        var data = {};
        data[res.shift()] = res.join(" ");
        return data;
    }

    function getString(data, key) {
        var str = data[key] || "";
        return str.replace(/"/g, "");
    }

    function getNumber(data, key) {
        return parseFloat(data[key]);
    }

    function getSrid(koordsys) {
        koordsys = parseInt(koordsys, 10);
        if (ns.koordsysMap[koordsys]) {
            return ns.koordsysMap[koordsys].srid;
        }
        throw new Error("KOORDSYS = " + koordsys + " not found!");
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
        data = _.filter(data.split(" "), function (element) {
            return element !== "";
        });
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
                } else {
                    res[parent].push(line);
                }
                return res;
            }, {});


            //console.log(immediate);

            return _.reduce(immediate, function (res, value, key) {
                if (_.isArray(value)) {
                    res[key] = _.reduce(value, function (arr, line) {
                        return _.extend(arr, parseLine(line.replace("...", "")));
                    }, {});
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
            this.kvalitet = ns.util.parseQuality(data["KVALITET"]);
            this.bbox = parseBbox(data["OMRÅDE"]);
            this.origo = parseOrigo(data["TRANSPAR"]["ORIGO-NØ"]);
            this.enhet = parseFloat(data["TRANSPAR"]["ENHET"]);
            this.vertdatum = getString(data["TRANSPAR"], "VERT-DATUM");
            this.srid = getSrid(data["TRANSPAR"]["KOORDSYS"]);
        }
    });

}(SOSI));