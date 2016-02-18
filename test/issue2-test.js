'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../src/sosi');
var fs = require('fs');

describe('Issue #2', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/testfile2.sos', 'utf8');
    });

    it('should be able to read attributes', function () {
        var sosidata = parser.parse(data);
        assert(sosidata.features.all());

        var flate = sosidata.features.getById(5);
        assert.equals(flate.attributes.kvalitet.målemetode, NaN);
    });

    it('should be able to get KURVE 606', function () {
        var sosidata = parser.parse(data);
        var kurve606 = sosidata.features.getById(606);
        assert(kurve606);
    });

    //test issue 20
    it('should be able to write to TopoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);
    });

    //test issue 20
    it('should be able to write to GeoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('geojson', name);
        assert(json);
    });

});

