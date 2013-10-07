var SOSI = window.SOSI || {};

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
            if (!data.id) {
                throw new Error("Feature must have ID!");
            }
            this.id = data.id;
            this.parseData(data, origo, unit, features);
            this.geometryType = data.geometryType;
        },

        parseData: function (data, origo, unit, features) {

            var foundGeom = false;
            var parsed = _.reduce(data.lines, function (result, line) {
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

            this.raw_data = {
                geometryType: data.geometryType,
                geometry: parsed.geometry,
                origo: origo,
                unit: unit
            };
        },

        buildGeometry: function (features) {
            if (this.raw_data.geometryType === "FLATE") {
                this.geometry = new ns.Polygon(this.attributes["REF"], features);
                this.geometry.center = new ns.Point(this.raw_data.geometry, this.raw_data.origo, this.raw_data.unit);
                this.attributes = _.omit(this.attributes, "REF");
            } else {
                this.geometry = createGeometry(this.raw_data.geometryType, this.raw_data.geometry, this.raw_data.origo, this.raw_data.unit);
            }
            this.raw_data = null;
        }
    });

    ns.Features = ns.Base.extend({

        initialize: function (elements, head) {
            this.head = head;
            this.features = [];
            this.features = _.map(elements, function (value, key) {
                key = key.replace(":", "").split(" ");
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: value
                };
                return new ns.Feature(data, head.origo, head.enhet);
            }, this);
        },

        ensureGeom: function (feature) {
            if (!feature.geometry) {
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