'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../src/sosi');
var fs = require('fs');

describe('Issue #4', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/testfile_issue4.sos', 'utf8');
    });


    it('should be able to read transpar that is not shorthand', function () {
        var sosidata = parser.parse(data);
        assert.equals(sosidata.hode.srid, 'EPSG:32632');
        assert.equals(sosidata.hode.origo.x, 0);
        assert.equals(sosidata.hode.origo.y, 0);
        assert.equals(sosidata.hode.enhet, 0.01);
    });

    it('should get repeated values for attributes as a array', function () {
        var sosidata = parser.parse(data);
        var kurve = sosidata.features.getById(119);

        assert.equals(kurve.attributes.LTEMA.length, 5);
        assert.equals(kurve.attributes.LTEMA[0], '4002');
        assert.equals(kurve.attributes.LTEMA[1], '4003');
        assert.equals(kurve.attributes.LTEMA[2], '4011');
        assert.equals(kurve.attributes.LTEMA[3], '4005');
        assert.equals(kurve.attributes.LTEMA[4], '4019');
    });
});
