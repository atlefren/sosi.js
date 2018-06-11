'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var fs = require('fs');



describe('etorg1', function () {
    var parser;

    before(function () {
        parser = new SOSI.Parser();
    });

    it.only('should handle multiline', function () {
        var data = fs.readFileSync('./data/etorg1.sos');
        var sosidata = parser.parse(data);

        console.log(sosidata.hode)
        assert.equals(sosidata.hode.produsent, 'Noe her\nnoe@noe.her');
        assert.equals(sosidata.features.length(), 1);
        var json =  sosidata.dumps('geojson');
        assert.equals(json.features.length, 1);
    });
});