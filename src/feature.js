var SOSI = window.SOSI || {};

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

}(SOSI));