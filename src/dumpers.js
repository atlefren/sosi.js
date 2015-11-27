var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function writePoint(point) {
        var p = [point.x, point.y];
        if (_.has(point, 'z')) {
            p.push(point.z);
        }
        return p;
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
                        var feature = this.sosidata.features.getById(Math.abs(hole[0]));
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

}(SOSI));
