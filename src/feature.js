var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function createGeometry(geometryType, lines, origo, unit) {

        var geometryTypes = {
            "PUNKT": ns.Point,
            "TEKST": ns.Point, // a point feature with exsta styling hints - the geometry actually consists of up to three points
            "KURVE": ns.LineString,
            "BUEP" : ns.LineStringFromArc,
            "LINJE": ns.LineString, // old 4.0 name for unsmoothed KURVE
            "FLATE": ns.Polygon
        };

        if (!geometryTypes[geometryType]) {
            throw new Error("GeometryType " + geometryType + " is not handled (yet..?)");
        }
        return new geometryTypes[geometryType](lines, origo, unit);
    }

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
                if (ns.util.specialAttributes[key]) {
                    attrs[key] = ns.util.specialAttributes[key].createFunction(value);
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
            this.index = [];
            this.features = _.object(_.map(elements, function (value, key) {
                key = key.replace(":", "").split(/\s+/);
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: _.rest(value)
                };
                this.index.push(data.id);
                return [data.id, new ns.Feature(data, head.origo, head.enhet)];
            }, this));
        },

        ensureGeom: function (feature) {
            if (feature && !feature.geometry) {
                feature.buildGeometry(this);
            }
            return feature;
        },

        length: function () {
            return _.size(this.features);
        },

        at: function(i) {
          return this.getById(this.index[i]);
        },

        getById: function (id) {
            return this.ensureGeom(this.features[id]);
        },

        all: function (ordered) {
            if (ordered) {
              return _.map(this.index, this.getById, this); /* order comes at a 25% performance loss */ 
            } else {
              return _.map(this.features, this.ensureGeom, this);
            }
        }
    });

}(SOSI));
