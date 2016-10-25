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
    });
});

