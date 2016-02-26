'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var Polygon = require('../src/geometry/Polygon');
var fs = require('fs');

describe('Grouped attributes', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/fastmerke.sos', 'utf8');
    });


    it('should read fastmerke.sos', function () {

        var sosidata = parser.parse(data);
        assert(sosidata.hode);
        assert(sosidata.def);
        assert(sosidata.objdef);
        assert(sosidata.features);

        assert(sosidata.features.length(), 1);


        var fastmerke = sosidata.features.getById(1);
        assert(fastmerke);
        assert.equals(fastmerke.attributes.kvalitet.synbarhet, NaN);
        assert.equals(fastmerke.attributes.fastmerkeSentrumRef, 'TB');
        assert.equals(fastmerke.attributes.fastmerkeType.fastmerkeUnderlag, 1);
        assert.equals(fastmerke.attributes.høydeOverBakken, 0.02);
        assert(fastmerke.attributes.punktBeskrivelse.match(/BIL\.$/));
    });

});
