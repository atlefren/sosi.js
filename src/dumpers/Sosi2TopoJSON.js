'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('../geometry/Point');
var LineString = require('../geometry/LineString');
var Polygon = require('../geometry/Polygon');
var writePoint = require('./writePoint');

/*
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
*/

function getIndex(arc, mapping) {
    var arcId = Math.abs(arc);
    var index = _.findWhere(mapping, {id: arcId}).index;
    if (arc < 0) {
        index = -index;
    }
    return index;
}

function mapArcs(arcs, mapping) {
    return _.map(arcs, function (arcs) {
        if (_.isArray(arcs)) {
            return _.map(arcs, function (arc) {
                return getIndex(arc, mapping);
            });
        }
        return getIndex(arcs, mapping);
    });
}


var Sosi2TopoJSON = Base.extend({

    initialize: function (sosidata) {
        this.sosidata = sosidata;
    },

    dumps: function (name) {
        var points = this.getPoints();
        var lines = this.getLines();

        var polygons = this.getPolygons(lines);

        var geometries = points.concat(lines).concat(polygons);

        var exclude = this.sosidata.features.exclude;
        geometries = _.filter(geometries, function (geom) {
            return exclude.indexOf(geom.properties.id) === -1;
        });

        var data = {
            'type': 'Topology',
            'objects': {}
        };
        data.objects[name] = {
            'type': 'GeometryCollection',
            'geometries': geometries
        };

        var allArcs = _.chain(polygons.concat(lines))
            .map(function (geom) {
                return _.map(geom.arcs, function (arcs) {
                    if (_.isArray(arcs)) {
                        return _.map(arcs, function (arc) {
                            return Math.abs(arc);
                        });
                    }
                    return Math.abs(arcs);
                });
            })
            .flatten()
            .uniq()
            .value();

        var arcs = _.chain(this.getArcs())
            .filter(function (arc) {
                return allArcs.indexOf(arc.id) > -1;
            })
            .map(function (arc, index) {
                arc.index = index;
                return arc;
            })
            .value();

        geometries = _.map(geometries, function (geometry) {
            if (geometry.arcs) {
                geometry.arcs = mapArcs(geometry.arcs, arcs);
            }
            return geometry;
        });

        var usedArcs = _.chain(geometries)
            .map(function (geometry) {
                if (geometry.arcs) {
                    return geometry.arcs;
                }
            })
            .compact()
            .flatten()
            .map(function (arc) {
                return Math.abs(arc);
            })
            .uniq()
            .value();


        if (arcs.length) {
            data.arcs = _.chain(arcs)
                .filter(function (arc) {
                    return usedArcs.indexOf(arc.index) > -1;
                })
                .pluck('arc')
                .value();
        }

        return data;
    },

    getByType: function (type) {
        return _.filter(this.sosidata.features._all(), function (feature) {
            return (feature.geometry instanceof type);
        });
    },

    getPoints: function () {
        var points = this.getByType(Point);
        return _.map(points, function (point) {
            var properties = _.clone(point.attributes);
            properties.id = point.id;
            return {
                'type': 'Point',
                'properties': properties,
                'coordinates': writePoint(point.geometry)
            };
        });
    },

    getArcs: function () {
        var lines = this.getByType(LineString);
        return _.map(lines, function (line) {
            return {
                id: line.id,
                arc: _.map(line.geometry.kurve, writePoint)
            };
        });
    },

    getLines: function () {
        var lines = this.getByType(LineString);
        return _.map(lines, function (line) {
            var properties = _.clone(line.attributes);
            properties.id = line.id;
            return {
                'type': 'LineString',
                'properties': properties,
                'arcs': [line.id]
            };
        });
    },

    getPolygons: function (lines) {
        var polygons = this.getByType(Polygon);
        return _.map(polygons, function (polygon) {
            var properties = _.clone(polygon.attributes);
            properties.id = polygon.id;

            var arcs = [polygon.geometry.shellRefs];

            arcs = arcs.concat(_.map(polygon.geometry.holeRefs, function (hole) {
                if (hole.length === 1) {
                    var feature = this.sosidata.features.getById(Math.abs(hole[0]));
                    if (feature.geometry instanceof Polygon) {
                        return feature.geometry.shellRefs;
                    }
                }

                return hole;
            }, this));

            return {
                'type': 'Polygon',
                'properties': properties,
                'arcs': arcs
            };
        }, this);
    }
});

module.exports = Sosi2TopoJSON;
