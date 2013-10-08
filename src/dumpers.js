var SOSI = window.SOSI || {};

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

    ns.Sosi2TopoJSON = ns.Base.extend({

        initialize: function (sosidata) {
            this.sosidata = sosidata;
        },

        dumps: function (name) {
            var points = this.getPoints();
            var lines = this.getLines();
            var geometries = points.concat(_.map(lines, function (line) {
                return line.geometry;
            }));

            var data = {
                "type": "Topology",
                "objects": {}
            };
            data.objects[name] = {
                "type": "GeometryCollection",
                "geometries": geometries
            };
            if (lines.length) {
                data.arcs = _.map(lines, function (line) {
                    return line.arc;
                });
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
            return _.map(lines, function (line, index) {
                var properties = _.clone(line.attributes);
                properties.id = line.id;
                return {
                    "geometry": {
                        "type": "LineString",
                        "properties": properties,
                        "arcs": [index]
                    },
                    "arc": _.map(line.geometry.kurve, writePoint),
                    "SOSI_ID": line.id
                };
            });
        }
    });

    }(SOSI));