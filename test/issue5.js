'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var fs = require('fs');



describe('issue5', function () {
    var parser;

    before(function () {
        parser = new SOSI.Parser();
    });


    it('should not die on FLATE without center point', function () {
        var data = fs.readFileSync('./data/issue5.SOS');
        var sosidata = parser.parse(data);
        assert.equals(sosidata.features.length(), 2);
        var json =  sosidata.dumps('geojson');
        assert.equals(json.features.length, 2);
    });
});