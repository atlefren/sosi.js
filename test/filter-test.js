'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var Polygon = require('../src/geometry/Polygon');
var fs = require('fs');

describe('Flate', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/flatetest.sos', 'utf8');
    });

    it('be able to read all features without filter', function () {
        var sosidata = parser.parse(data);
        assert.equals(sosidata.features.all().length, 5);
    });

    it('be able to limit features with filter', function () {

        var filter = function (feature) {
            return feature.attributes.objekttypenavn === 'Tank';
        };

        var sosidata = parser.parse(data).filter(filter);
        assert.equals(sosidata.features.all().length, 1);
        assert.equals(sosidata.features.all()[0].attributes.objekttypenavn, 'Tank');
    });

    it('be able to map attributes', function () {

        var filter = function (feature) {
            return feature.attributes.objekttypenavn === 'Tank';
        };

        var map = function (attributes) {
            return {
                'test': 'test'
            };
        };

        var sosidata = parser.parse(data).filter(filter).mapAttributes(map);
        assert.equals(sosidata.features.all().length, 1);

        assert.equals(sosidata.features.all()[0].attributes.test, 'test');
        assert.equals(_.keys(sosidata.features.all()[0].attributes).length, 1);

        assert.equals(sosidata.features.at(0).attributes.test, 'test');

        assert.equals(sosidata.features.getById(651).attributes.test, 'test');
    });

    it('be able to dump to geojson after filter', function () {

        var filter = function (feature) {
            return feature.attributes.objekttypenavn === 'Tank';
        };

        var sosidata = parser.parse(data).filter(filter);
        var json = sosidata.dumps('geojson');
        assert(json);
    });

    it('be able to dump to topojson after filter', function () {

        var filter = function (feature) {
            return feature.attributes.objekttypenavn === 'Tank';
        };

        var sosidata = parser.parse(data).filter(filter);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);
    });

    it('should only include referenced lines in topojson after filter', function () {

        var filter = function (feature) {
            return feature.attributes.objekttypenavn === 'Tank';
        };

        var sosidata = parser.parse(fs.readFileSync('./data/flatetest2.sos', 'utf8')).filter(filter);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);
        assert.equals(json.objects.testdata.geometries.length, 1);
        assert.equals(json.arcs.length, 4);

    });
});

