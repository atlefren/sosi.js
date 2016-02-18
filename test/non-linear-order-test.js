'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../src/sosi');
var fs = require('fs');
var Polygon = require('../src/geometry/Polygon');

describe('Non-linear', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/non-linear.sos', 'utf8');
    });


    it('Should be able to build a geometry for a KURVE that is defined before the FLATE it consists of', function () {

        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(500);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 5);

        assert.equals(flate.geometry.flate[0].x, 300010);
        assert.equals(flate.geometry.flate[0].y, 7000010);

        assert.equals(flate.geometry.flate[1].x, 300010);
        assert.equals(flate.geometry.flate[1].y, 7000020);

        assert.equals(flate.geometry.flate[2].x, 300020);
        assert.equals(flate.geometry.flate[2].y, 7000020);

        assert.equals(flate.geometry.flate[3].x, 300020);
        assert.equals(flate.geometry.flate[3].y, 7000010);

        assert.equals(flate.geometry.flate[4].x, 300010);
        assert.equals(flate.geometry.flate[4].y, 7000010);

    });

});
