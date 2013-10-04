var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function createGeometry (geometryType, lines, origo, unit) {

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

        initialize: function (elements, hode) {
            this.hode = hode;
            this.features = [];
            _.each(elements, function (value, key) {
                key = key.replace(":", "").split(" ");
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: value
                };
                 this.features.push(new ns.Feature(data, hode.origo, hode.enhet, this));
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
            })
        },

        all: function () {
            return this.features;
        }
    });

}(SOSI));