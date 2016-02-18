'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('../geometry/Point');
var LineString = require('../geometry/LineString');
var Polygon = require('../geometry/Polygon');
var writePoint = require('./writePoint');


var Sosi2GeoJSON = Base.extend({

    initialize: function (sosidata) {
        this.sosidata = sosidata;
    },

    dumps: function () {
        return {
            'type': 'FeatureCollection',
            'features': this.getFeatures(),
            'crs': this.writeCrs()
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
            'type': 'Feature',
            'id': sosifeature.id,
            'properties': sosifeature.attributes,
            'geometry': this.writeGeometry(sosifeature.geometry)
        };
    },

    writeGeometry: function (geom) {
        if (geom instanceof Point) {
            return {
                'type': 'Point',
                'coordinates': writePoint(geom)
            };
        }

        if (geom instanceof LineString) {
            return {
                'type': 'LineString',
                'coordinates': _.map(geom.kurve, writePoint)
            };
        }

        if (geom instanceof Polygon) {
            var shell = _.map(geom.flate, writePoint);
            var holes = _.map(geom.holes, function (hole) {
                return _.map(hole, writePoint);
            });
            return {
                'type': 'Polygon',
                'coordinates': [shell].concat(holes)
            };
        }
        throw new Error('cannot write geometry!');
    },

    writeCrs: function () {
        return {
            'type': 'name',
            'properties': {
                'name': this.sosidata.hode.srid
            }
        };
    }
});

module.exports = Sosi2GeoJSON;
