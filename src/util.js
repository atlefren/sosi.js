var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function getValues(line) {
        return _.rest(line.split(" ")).join(" ").trim();
    }

    function getNumDots(num) {
        return new Array(num + 1).join(".");
    }

    function getKeyFromLine(line) {
        if (line.indexOf(":") !== -1) {
            return _.first(line.split(":")).trim();
        }
        return _.first(line.split(" ")).trim();
    }

    function cleanupLine(line) {
        if (line.indexOf('!') !== -1) {
            line = line.substring(0, line.indexOf('!'));
        }
        return line.replace(/\s+$/, '');
    }

    function getKey(line, parentLevel) {
        return cleanupLine(
            getKeyFromLine(
                line.replace(getNumDots(parentLevel), "")
            )
        );
    }

    function pushOrCreate(dict, val) {
        if (!_.isArray(dict.objects[dict.key])) {
            dict.objects[dict.key] = [];
        }
        dict.objects[dict.key].push(val);
    }

    function c2(str) {
        var substr = str.substr(0, _.lastIndexOf(str, ".") + 1);
        if (_.every(substr, function (character) {return (character === "."); })) {
            return substr.length;
        }
        return 0;
    }

    function countStartingDots(str) {
        var differs = _.find(str, function (character) {return (character !== "."); });
        if (differs) {
            str = str.substr(0, _.indexOf(str, differs));
        }
        if (_.every(str, function (character) {  return (character === "."); })) {
            return str.length;
        }
        return 0;
    }

    function isParent(line, parentLevel) {
        return (countStartingDots(line) === parentLevel);
    }

    function isEmpty(line) {
        return line === "";
    }

    function parseTree(data, parentLevel) {
        return _.reduce(_.reject(data, isEmpty), function (res, line) {
            line = cleanupLine(line);
            if (isParent(line, parentLevel)) {
                res.key = getKey(line, parentLevel);
                line = getValues(line);
            }
            if (!isEmpty(line)) {
                pushOrCreate(res, line);
            }
            return res;
        }, {objects: {}}).objects;
    }

    function setDataType(key, value) {

        if (!ns.types) {
            return value;
        }

        var type = _.isArray(key) ? key : SOSI.types[key];
        if (type) {
            if (!_.isObject(type[0])) {
                if (type[1] === "Integer") {
                    return parseInt(value, 10);
                } else if (type[1] === "Real") {
                    return parseFloat(value);
                } else if (type[1] === "Date") {
                    if (value.length === 8) {
                        return new Date(
                            parseInt(value.substring(0, 4), 10),
                            parseInt(value.substring(4, 6), 10) - 1,
                            parseInt(value.substring(6, 8), 10)
                        );
                    } else if (value.length === 14) {
                        return new Date(
                            parseInt(value.substring(0, 4), 10),
                            parseInt(value.substring(4, 6), 10) - 1,
                            parseInt(value.substring(6, 8), 10),
                            parseInt(value.substring(8, 10), 10),
                            parseInt(value.substring(10, 12), 10),
                            parseInt(value.substring(12, 14), 10)
                        );
                    }
                } else if (_.isString(type[1])) {
                    if (value[0] === '"' || value[0] === "'") {
                        return value.substring(1, value.length - 1);
                    }
                    return value;
                }
            }
        }
        return value;
    }

    function parseSpecial(key, subfields) {
        return function (data) {
            if (!data) {
                return null;
            }
            if (_.isObject(data)) {
                return data; // extended subfields
            }
            if (_.isString(data)) {
                return _.reduce(data.match(/"[^"]*"|'[^']*'|\S+/g), function (res, chunk, i) {
                    res[subfields[i][0]] = setDataType(subfields[i], chunk);
                    return res;
                }, {});
            }
        };
    }

    function getLongname(key) { // not tested
        if (ns.types && ns.types[key]) {
            var type = ns.types[key];
            return !!type && type[0] || key; //ambiguity ahoy!
        }
        return key;
    }

    function parseSubdict(lines) {
        return _.reduce(parseTree(lines, 3), function (subdict, value, key) {
            subdict[getLongname(key)] = setDataType(key, value[0]);
            return subdict;
        }, {});
    }

    ns.util = {

        parseTree: parseTree,

        cleanupLine: cleanupLine,

        getLongname: getLongname,

        parseFromLevel2: function (data) {
            return _.reduce(parseTree(data, 2), function (dict, lines, key) {
                if (lines.length) {
                    if (lines[0][0] === ".") {
                        dict[getLongname(key)] = parseSubdict(lines);
                    } else if (lines.length > 1) {
                        dict[getLongname(key)] = _.map(lines, function (value) {
                            return setDataType(key, value);
                        });
                    } else {
                        dict[getLongname(key)] = setDataType(key, lines[0]);
                    }
                }
                return dict;
            }, {});
        },

        specialAttributes: (function () {
            if (!!SOSI.types) {
                return _.reduce(SOSI.types, function (attrs, type, key) {
                    if (_.isObject(type[1])) { // true for complex datatypes
                        attrs[type[0]] = {name: type[0], createFunction: parseSpecial(key, type[1])};
                    }
                    return attrs;
                }, {});
            }
        }()),

        round: function (number, numDecimals) {
            var pow = Math.pow(10, numDecimals);
            return Math.round(number * pow) / pow;
        }
    };

    ns.geosysMap = {
        2: {"srid": "EPSG:4326", def: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs "}
    };

    ns.koordsysMap = {
        1: {"srid": "EPSG:27391", "def": "+proj=tmerc +lat_0=58 +lon_0=-4.666666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        2: {"srid": "EPSG:27392", "def": "+proj=tmerc +lat_0=58 +lon_0=-2.333333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        3: {"srid": "EPSG:27393", "def": "+proj=tmerc +lat_0=58 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        4: {"srid": "EPSG:27394", "def": "+proj=tmerc +lat_0=58 +lon_0=2.5 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        5: {"srid": "EPSG:27395", "def": "+proj=tmerc +lat_0=58 +lon_0=6.166666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        6: {"srid": "EPSG:27396", "def": "+proj=tmerc +lat_0=58 +lon_0=10.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        7: {"srid": "EPSG:27397", "def": "+proj=tmerc +lat_0=58 +lon_0=14.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        8: {"srid": "EPSG:27398", "def": "+proj=tmerc +lat_0=58 +lon_0=18.33333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        9: {"srid": "EPSG:4273", "def": "+proj=longlat +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +no_defs"},
        21: {"srid": "EPSG:32631", "def": "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        22: {"srid": "EPSG:32632", "def": "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        23: {"srid": "EPSG:32633", "def": "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        24: {"srid": "EPSG:32634", "def": "+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        25: {"srid": "EPSG:32635", "def": "+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        26: {"srid": "EPSG:32636", "def": "+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        31: {"srid": "EPSG:23031", def: "+proj=utm +zone=31 +ellps=intl +units=m +no_defs"},
        32: {"srid": "EPSG:23032", def: "+proj=utm +zone=32 +ellps=intl +units=m +no_defs"},
        33: {"srid": "EPSG:23033", def: "+proj=utm +zone=33 +ellps=intl +units=m +no_defs"},
        34: {"srid": "EPSG:23034", def: "+proj=utm +zone=34 +ellps=intl +units=m +no_defs"},
        35: {"srid": "EPSG:23035", def: "+proj=utm +zone=35 +ellps=intl +units=m +no_defs"},
        36: {"srid": "EPSG:23036", def: "+proj=utm +zone=36 +ellps=intl +units=m +no_defs"},
        50: {"srid": "EPSG:4230", def: "+proj=longlat +ellps=intl +no_defs"},
        72: {"srid": "EPSG:4322", def: "+proj=longlat +ellps=WGS72 +no_defs "},
        84: {"srid": "EPSG:4326", def: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs "},
        87: {"srid": "EPSG:4231", "def": "+proj=longlat +ellps=intl +no_defs "}

        //41 Lokalnett, uspes.
        //42 Lokalnett, uspes.
        //51 NGO-56A (Møre) NGO1948 Gauss-Krüger
        //52 NGO-56B (Møre) NGO1948 Gauss-Krüger
        //53 NGO-64A (Møre) NGO1948 Gauss-Krüger
        //54 NGO-64B (Møre) NGO1948 Gauss-Krüger
        //99 Egendefinert *
        //101 Lokalnett, Oslo
        //102 Lokalnett, Bærum
        //103 Lokalnett, Asker
        //104 Lokalnett, Lillehammer
        //105 Lokalnett,Drammen
        //106 Lokalnett, Bergen / Askøy
    };


    //add proj4 defs so that proj4js works
    _.each(ns.koordsysMap, function (koordsys) {
        if (!_.isUndefined(window.proj4)) { // newer proj4js (>=1.3.1)
            proj4.defs(koordsys.srid, koordsys.def);
        } else if (!_.isUndefined(window.Proj4js)) { //older proj4js (=< 1.1.0)
            Proj4js.defs[koordsys.srid] = koordsys.def;
        }
    });

}(SOSI));
