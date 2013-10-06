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



;var SOSI = window.SOSI || {};

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
            return ns.koordsysMap[koordsys];
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

}(SOSI));;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({

        knutepunkt: false,

        initialize: function (line, origo, unit) {
            if (_.isArray(line)) {
                line = line[1];
            }

            var coords = line.split(" ");

            this.y = ns.util.round((parseInt(coords[0], 10) * unit) + origo.y, 2);
            this.x = ns.util.round((parseInt(coords[1], 10) * unit) + origo.x, 2);

            if (coords[2] && !isNaN(coords[2])) {
                this.z = parseInt(coords[1], 10) * unit;
            }

            if (line.indexOf(".KP") !== -1) {
                this.setTiepoint(line.substring(line.indexOf(".KP"), line.length).split(" ")[1]);
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
                geom =  geom.reverse();
            }
            return _.initial(geom);
        }));
        flate.push(flate[0]);
        return flate;
    }

    ns.Polygon = ns.Base.extend({
        initialize: function (refs, features) {
            var holeIdx = -1;
            refs = _.reduce(refs.split(" "), function (res, ref) {
                ref = ref.replace(/:/g, "");
                if (ref.indexOf("(") !== -1) {
                    holeIdx += 1;
                    res.holes.push([]);
                    ref = ref.replace("(", "");
                }
                if (ref.indexOf(")") !== -1) {
                    ref = ref.replace(")", "");
                }
                if (holeIdx === -1) {
                    res.shell.push(parseInt(ref, 10));
                } else {
                    res.holes[holeIdx].push(parseInt(ref, 10));
                }
                return res;
            }, {holes: [], "shell": []});

            this.flate = createPolygon(refs.shell, features);

            this.holes = _.map(refs.holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(hole[0]);
                    if (feature.geometryType === "FLATE") {
                        return feature.geometry.flate;
                    }
                }
                return createPolygon(hole, features);
            });
        }
    });
}(SOSI));;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function createGeometry(geometryType, lines, origo, unit) {

        var geometryTypes = {
            "PUNKT": ns.Point,
            "KURVE": ns.LineString,
            "FLATE": ns.Polygon
        };

        if (!geometryTypes[geometryType]) {
            //throw new Error("GeometryType " + geometryType + " is not handled (yet..?)");
            return null;
        }
        return new geometryTypes[geometryType](lines, origo, unit);
    }

    var specialAttributes = {
        "KVALITET": {"name": "kvalitet", "function": ns.util.parseQuality}
    };

    ns.Feature = ns.Base.extend({

        initialize: function (data, origo, unit, features) {
            if (! data.id) {
                throw new Error("Feature must have ID!");
            }
            this.id = data.id;
            this.parseData(data, origo, unit, features);
            this.geometryType = data.geometryType;
        },

        parseData: function (data, origo, unit, features) {

            var foundGeom = false;
            var parsed = _.reduce(data.lines, function (result, line){
                line = ns.util.cleanupLine(line).replace("..", "");
                if (line.indexOf("NØ") !== -1) {
                    foundGeom = true;
                }
                if (!foundGeom) {
                    result.attributes.push(line);
                } else {
                    result.geometry.push(line);
                }
                return result;
            }, {"attributes": [], "geometry": []});


            this.attributes = _.reduce(parsed.attributes, function (attributes, line) {
                line = line.split(" ");
                var key = line.shift();
                if (!specialAttributes[key]) {
                    attributes[key] = line.join(" ");
                } else {
                    attributes[specialAttributes[key].name] = specialAttributes[key].function(line.join(" "));
                }
                return attributes;
            }, {});

            if (data.geometryType === "FLATE") {
                this.geometry = new ns.Polygon(this.attributes["REF"], features);
                this.geometry.center = new ns.Point(parsed.geometry, origo, unit);
                this.attributes = _.omit(this.attributes, "REF")
            } else {
                this.geometry = createGeometry(data.geometryType, parsed.geometry, origo, unit);
            }
        }
    });

    ns.Features = ns.Base.extend({

        initialize: function (elements, head) {
            this.head = head;
            this.features = [];
            _.each(elements, function (value, key) {
                key = key.replace(":", "").split(" ");
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: value
                };
                this.features.push(new ns.Feature(data, head.origo, head.enhet, this));
            }, this);
        },

        length: function () {
            return this.features.length;
        },

        at: function (idx) {
            return this.features[idx];
        },

        getById: function (id) {
            return _.find(this.features, function (feature) {
                return (feature.id === id);
            });
        },

        all: function () {
            return this.features;
        }
    });

}(SOSI));;var SOSI = window.SOSI || {};

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
            return _.map(this.sosidata.features.all(), this.createGeoJsonFeature, this);
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

}(SOSI));;var SOSI = window.SOSI || {};

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
                    } else if (parent) {
                        res[parent].push(line);
                    }
                }
                return res;
            }, {});
            return new SosiData(res);
        }
    });
}(SOSI));