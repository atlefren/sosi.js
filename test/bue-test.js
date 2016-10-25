'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var fs = require('fs');

describe('Bue', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/buer.sos', 'utf8');
    });

    it('should read bue.sos', function () {

        var sosidata = parser.parse(data);
        assert(sosidata.hode);
        assert(sosidata.def);
        assert(sosidata.objdef);
        assert(sosidata.features);
        assert(sosidata.features.length(), 127);

        var bue26 = sosidata.features.getById(26);
        assert(bue26);
        assert.equals(bue26.geometry.kurve.length, 56);
    });

    it('should have joints', function () {
        var sosidata = parser.parse(data);
        var bue26 = sosidata.features.getById(26);
        assert.equals(bue26.geometry.knutepunkter.length, 2);
        assert.equals(bue26.geometry.knutepunkter[1].x, 474237.85);
    });

    it('should be able to write to GeoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('geojson', name);
        assert(json);
    });

    it('should be able to write to TopoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);
    });

    it('should handle buep error', function () {
        var sosidata = parser.parse(fs.readFileSync('./data/buep.sos', 'utf8'));
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);
    });

});
