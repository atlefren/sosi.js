var SOSI = window.SOSI || {};

/**
 * This is adopted from backbone.js which
 * is available for use under the MIT software license.
 * see http://github.com/jashkenas/backbone/blob/master/LICENSE
 */
(function (ns, undefined) {
    "use strict";

    ns.Base = function () {
        this.initialize.apply(this, arguments);
    };

    _.extend(ns.Base.prototype, {
        initialize: function () {}
    });

    ns.Base.extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }
            _.extend(child, parent, staticProps);
        var Surrogate = function () { this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }
        child.__super__ = parent.prototype;

        return child;
    };

}(SOSI));;var SOSI = window.SOSI || {};

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
        return line.replace(/\s\s*$/, '');
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

    function parseSubdict(lines) {
        return _.reduce(parseTree(lines, 3), function (subdict, value, key) {
            subdict[key] = value[0];
            return subdict;
        }, {});
    }

    ns.util = {

        parseTree: parseTree,
        cleanupLine: cleanupLine,

        parseFromLevel2: function (data) {
            return _.reduce(parseTree(data, 2), function (dict, lines, key) {
                if (lines.length) {
                    if (lines[0][0] === ".") {
                        dict[key] = parseSubdict(lines);
                    } else if (lines.length > 1) {
                        dict[key] = lines;
                    } else {
                        dict[key] = lines[0];
                    }
                }
                return dict;
            }, {});
        },

        parseQuality: function (data) {

            if (!data) {
                return null;
            }

            var qualityShorthand = [
                "målemetode",
                "nøyaktighet",
                "synbarhet",
                "h-målemetode",
                "h-nøyaktighet",
                "max-avvik"
            ];

            if (_.isString(data)) {
                return _.reduce(data.split(/\s+/), function (res, number, i) {
                    var asInt = parseInt(number, 10);
                    res[qualityShorthand[i]] = isNaN(asInt) ? number : asInt;
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
        if (proj4) { // newer proj4js (>=1.3.1)
            proj4.defs(koordsys.srid, koordsys.def);
        } else if (Proj4js) { //older proj4js (=< 1.1.0)
            Proj4js.defs[koordsys.srid] = koordsys.def;
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

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

    function getSridFromGeosys(geosys) {
        if (_.isArray(geosys)) {
            throw new Error("GEOSYS cannot be parsed in uncompacted form yet.");
        } else {
            geosys = geosys.split(/\s+/);
        }
        if (ns.geosysMap[geosys[0]]) {
            return ns.geosysMap[geosys[0]];
        }
        throw new Error("GEOSYS = " + geosys + " not found!");
    }

    function parseBbox(data) {
        var ll = data["MIN-NØ"].split(/\s+/);
        var ur = data["MAX-NØ"].split(/\s+/);
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
            return ns.util.parseFromLevel2(data);
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
            if (data["TRANSPAR"]["KOORDSYS"]) {
                this.srid = getSrid(data["TRANSPAR"]["KOORDSYS"]);
            } else {
                this.srid = getSridFromGeosys(data["TRANSPAR"]["GEOSYS"]);
            }
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({

        knutepunkt: false,

        initialize: function (line, origo, unit) {
            if (_.isArray(line)) {
                line = line[1];
            }

            var coords = line.split(/\s+/);

            var numDecimals = 0;
            if (unit < 1) {
                numDecimals = -Math.floor(Math.log(unit) / Math.LN10);
            }

            this.y = ns.util.round((parseInt(coords[0], 10) * unit) + origo.y, numDecimals);
            this.x = ns.util.round((parseInt(coords[1], 10) * unit) + origo.x, numDecimals);

            if (coords[2] && !isNaN(coords[2])) {
                this.z = ns.util.round(parseInt(coords[2], 10) * unit, numDecimals);
            }

            if (line.indexOf(".KP") !== -1) {
                this.setTiepoint(
                    line.substring(line.indexOf(".KP"), line.length).split(" ")[1]
                );
            }
        },

        setTiepoint: function (kode) {
            this.has_tiepoint = true;
            this.knutepunktkode = parseInt(kode, 10);
        }
    });

    ns.LineString = ns.Base.extend({
        initialize: function (lines, origo, unit) {
            this.kurve = _.compact(_.map(lines, function (line) {
                if (line.indexOf("NØ") === -1) {
                    return new ns.Point(line, origo, unit);
                }
            }));

            this.knutepunkter = _.filter(this.kurve, function (punkt) {
                return punkt.has_tiepoint;
            });
        }
    });

    function createPolygon(refs, features) {
        var flate =  _.flatten(_.map(refs, function (ref) {
            var id = Math.abs(ref);
            var kurve = features.getById(id);
            if (!kurve) {
                throw new Error("Fant ikke KURVE " + id + " for FLATE");
            }
            var geom = kurve.geometry.kurve;
            if (ref < 0) {
                geom = _.clone(geom).reverse();
            }
            return _.initial(geom);
        }));
        flate.push(flate[0]);
        return flate;
    }

    function parseRefs(refs) {
        return _.map(refs.trim().split(" "), function (ref) {
            return parseInt(ref.replace(":", ""), 10);
        });
    }

    ns.Polygon = ns.Base.extend({
        initialize: function (refs, features) {
            var shell = refs;
            var holes = [];
            var index = refs.indexOf("(");
            if (index !== -1) {
                shell = refs.substr(0, index);
                holes = refs.substr(index, refs.length);
            }

            shell = parseRefs(shell);
            holes = _.map(
                _.reduce(holes, function (result, character) {
                    if (character === "(") {
                        result.push("");
                    } else if (character !== ")" && character !== "") {
                        result[result.length - 1] += character;
                    }
                    return result;
                }, []),
                parseRefs
            );

            this.flate = createPolygon(shell, features);

            this.holes = _.map(holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(Math.abs(hole[0]));
                    if (feature.geometryType === "FLATE") {
                        return feature.geometry.flate;
                    }
                }
                return createPolygon(hole, features);
            });
            this.shellRefs = shell;
            this.holeRefs = holes;
        }
    });
}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function createGeometry(geometryType, lines, origo, unit) {

        var geometryTypes = {
            "PUNKT": ns.Point,
            "TEKST": ns.Point, // a point feature with exsta styling hints - the geometry actually consists of up to three points
            "KURVE": ns.LineString,
            "LINJE": ns.LineString, // old 4.0 name for unsmoothed KURVE
            "FLATE": ns.Polygon
        };

        if (!geometryTypes[geometryType]) {
            throw new Error("GeometryType " + geometryType + " is not handled (yet..?)");
        }
        return new geometryTypes[geometryType](lines, origo, unit);
    }

    var specialAttributes = {
        "KVALITET": {
            "name": "kvalitet",
            "createFunction": ns.util.parseQuality
        }
    };

    ns.Feature = ns.Base.extend({

        initialize: function (data, origo, unit, features) {
            if (data.id === undefined || data.id === null) {
                throw new Error("Feature must have ID!");
            }
            this.id = data.id;
            this.parseData(data, origo, unit, features);
            this.geometryType = data.geometryType;
        },

        parseData: function (data, origo, unit) {

            var split = _.reduce(data.lines, function (dict, line) {
                if (line.indexOf("..NØ") !== -1) {
                    dict.foundGeom = true;
                }
                if (dict.foundGeom) {
                    dict.geom.push(line);
                } else {
                    if (line.indexOf("..REF") !== -1) {
                        dict.foundRef = true;
                        line = line.replace("..REF", "");
                    }
                    if (dict.foundRef) {
                        if (line[0] === '.') {
                            dict.foundRef = false;
                        } else {
                            dict.refs.push(line);
                        }
                    } else {
                        dict.attributes.push(line);
                    }
                }
                return dict;
            }, {
                "attributes": [],
                "geom": [],
                "refs": [],
                "foundGeom": false,
                "foundRef": false
            });

            this.attributes = ns.util.parseFromLevel2(split.attributes);
            this.attributes = _.reduce(this.attributes, function (attrs, value, key) {
                if (specialAttributes[key]) {
                    attrs[key] = specialAttributes[key].createFunction(value);
                } else {
                    attrs[key] = value;
                }
                return attrs;
            }, {});

            if (split.refs.length > 0) {
                this.attributes.REF = split.refs.join(" ");
            }
            if (this.attributes.ENHET) {
              unit = parseFloat(this.attributes.ENHET);
            }

            this.raw_data = {
                geometryType: data.geometryType,
                geometry: split.geom,
                origo: origo,
                unit: unit
            };
        },

        buildGeometry: function (features) {
            if (this.raw_data.geometryType === "FLATE") {
                this.geometry = new ns.Polygon(this.attributes.REF, features);
                this.geometry.center = new ns.Point(
                    this.raw_data.geometry,
                    this.raw_data.origo,
                    this.raw_data.unit
                );
                this.attributes = _.omit(this.attributes, "REF");
            } else {
                this.geometry = createGeometry(
                    this.raw_data.geometryType,
                    this.raw_data.geometry,
                    this.raw_data.origo,
                    this.raw_data.unit
                );
            }
            this.raw_data = null;
        }
    });

    ns.Features = ns.Base.extend({

        initialize: function (elements, head) {
            this.head = head;
            this.features = [];
            this.features = _.map(elements, function (value, key) {
                key = key.replace(":", "").split(/\s+/);
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: _.rest(value)
                };
                return new ns.Feature(data, head.origo, head.enhet);
            }, this);
        },

        ensureGeom: function (feature) {
            if (feature && !feature.geometry) {
                feature.buildGeometry(this);
            }
            return feature;
        },

        length: function () {
            return this.features.length;
        },

        at: function (idx) {
            return this.ensureGeom(this.features[idx]);
        },

        getById: function (id) {
            return this.ensureGeom(_.find(this.features, function (feature) {
                return (feature.id === id);
            }));
        },

        all: function () {
            return _.map(this.features, this.ensureGeom, this);
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function writePoint(point) {
        return [point.x, point.y];
    }

    ns.Sosi2GeoJSON = ns.Base.extend({

        initialize: function (sosidata) {
            this.sosidata = sosidata;
        },

        dumps: function () {
            return {
                "type": "FeatureCollection",
                "features": this.getFeatures(),
                "crs": this.writeCrs()
            };
        },

        getFeatures: function () {
            return _.map(
                this.sosidata.features.all(),
                this.createGeoJsonFeature,
                this
            );
        },

        createGeoJsonFeature: function (sosifeature) {
            return {
                "type": "Feature",
                "id": sosifeature.id,
                "properties": sosifeature.attributes,
                "geometry": this.writeGeometry(sosifeature.geometry)
            };
        },

        writeGeometry: function (geom) {
            if (geom instanceof ns.Point) {
                return {
                    "type": "Point",
                    "coordinates": writePoint(geom)
                };
            }

            if (geom instanceof ns.LineString) {
                return {
                    "type": "LineString",
                    "coordinates": _.map(geom.kurve, writePoint)
                };
            }

            if (geom instanceof ns.Polygon) {
                var shell = _.map(geom.flate, writePoint);
                var holes = _.map(geom.holes, function (hole) {
                    return _.map(hole, writePoint);
                });
                return {
                    "type": "Polygon",
                    "coordinates": [shell].concat(holes)
                };
            }
            throw new Error("cannot write geometry!");
        },

        writeCrs: function () {
            return {
                "type": "name",
                "properties": {
                    "name": this.sosidata.hode.srid
                }
            };
        }
    });

    function mapArcs(refs, lines) {
        return _.map(refs, function (ref) {
            var index = lines[Math.abs(ref)].index;
            if (ref > 0) {
                return index;
            } else {
                return -(Math.abs(index) + 1);
            }
        });
    }

    ns.Sosi2TopoJSON = ns.Base.extend({

        initialize: function (sosidata) {
            this.sosidata = sosidata;
        },

        dumps: function (name) {
            var points = this.getPoints();
            var lines = this.getLines();
            var polygons = this.getPolygons(lines);
            var geometries = points.concat(_.map(lines, function (line) {
                return line.geometry;
            })).concat(polygons);

            var data = {
                "type": "Topology",
                "objects": {}
            };
            data.objects[name] = {
                "type": "GeometryCollection",
                "geometries": geometries
            };

            var arcs = _.map(_.sortBy(lines, function (line) {return line.index; }), function (line) {
                return line.arc;
            });

            if (arcs.length) {
                data.arcs = arcs;
            }
            return data;
        },

        getByType: function (type) {
            return _.filter(this.sosidata.features.all(), function (feature) {
                return (feature.geometry instanceof type);
            });
        },

        getPoints: function () {
            var points = this.getByType(ns.Point);
            return _.map(points, function (point) {
                var properties = _.clone(point.attributes);
                properties.id = point.id;
                return {
                    "type": "Point",
                    "properties": properties,
                    "coordinates": writePoint(point.geometry)
                };
            });
        },

        getLines: function () {
            var lines = this.getByType(ns.LineString);
            return _.reduce(lines, function (res, line, index) {
                var properties = _.clone(line.attributes);
                properties.id = line.id;
                res[line.id] = {
                    "geometry": {
                        "type": "LineString",
                        "properties": properties,
                        "arcs": [index]
                    },
                    "arc": _.map(line.geometry.kurve, writePoint),
                    "index": index
                };
                return res;
            }, {});
        },

        getPolygons: function (lines) {
            var polygons = this.getByType(ns.Polygon);
            return _.map(polygons, function (polygon) {
                var properties = _.clone(polygon.attributes);
                properties.id = polygon.id;

                var arcs = [mapArcs(polygon.geometry.shellRefs, lines)];

                arcs = arcs.concat(_.map(polygon.geometry.holeRefs, function (hole) {
                    if (hole.length === 1) {
                        var feature = this.sosidata.features.getById(hole[0]);
                        if (feature.geometry instanceof ns.Polygon) {
                            return mapArcs(feature.geometry.shellRefs, lines);
                        }
                    }
                    return mapArcs(hole, lines);
                }, this));

                return {
                    "type": "Polygon",
                    "properties": properties,
                    "arcs": arcs
                };
            }, this);
        }
    });

}(SOSI));;var SOSI = window.SOSI || {};

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
