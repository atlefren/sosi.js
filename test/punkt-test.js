'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var Point = require('../src/geometry/Point');
var fs = require('fs');

describe('Punkt', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/punkttest.sos', 'utf8');
    });


    it('should be able to read id', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);
        assert(feature1);
        assert.equals(feature1.id, 1);
    });

    it('should be able to read attributes', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);
        assert.equals(feature1.attributes.objekttypenavn, 'Fastmerke');
    });

    it('should be able to read geometry', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);
        assert(feature1.geometry instanceof Point);
        assert.equals(feature1.geometry.x, 10023.45);
        assert.equals(feature1.geometry.y, 100234.56);
    });

    it('should be able to write to geoJSON', function () {
        var sosidata = parser.parse(data);
        var json =  sosidata.dumps('geojson');
        assert(json);

        assert.equals(json.type, 'FeatureCollection');
        assert.equals(json.features.length, 1);

        var feature1 = json.features[0];

        assert.equals(feature1.type, 'Feature');
        assert.equals(feature1.id, 1);
        assert.equals(feature1.properties.objekttypenavn, 'Fastmerke');

        var geom = feature1.geometry;
        assert.equals(geom.type, 'Point');
        assert.equals(geom.coordinates, [10023.45, 100234.56]);

        assert(json.crs);
        assert.equals(json.crs.properties.name, 'EPSG:27395');
    });

    it('should be able to write to TopoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);

        assert.equals(json.type, 'Topology');
        assert.equals(json.objects[name].type, 'GeometryCollection');

        assert.equals(json.objects[name].geometries.length, 1);

        var geom1 = json.objects[name].geometries[0];

        assert.equals(geom1.type, 'Point');

        assert.equals(geom1.properties.id, 1);
        assert.equals(geom1.properties.objekttypenavn, 'Fastmerke');

        assert.equals(geom1.coordinates, [10023.45, 100234.56]);
    });
});
