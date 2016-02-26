'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var fs = require('fs');

describe('Real life example', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/naturvernomraade.sos', 'utf8');
    });


    it('should read naturvernomraade.sos', function () {

        var sosidata = parser.parse(data);
        assert(sosidata.hode);
        assert(sosidata.def);
        assert(sosidata.objdef);
        assert(sosidata.features);

        assert(sosidata.features.length(), 127);
        assert.equals(sosidata.hode.eier, 'Direktoratet for naturforvaltning');

        var flate_50 = sosidata.features.getById(50);

        assert(flate_50.attributes.identifikasjon, 'VV00000688');
        assert(flate_50.attributes.navn, 'Gaulosen');
    });

});
