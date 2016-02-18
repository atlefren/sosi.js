'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../src/sosi');
var fs = require('fs');
var datatypes = require('../src/util/datatypes');


describe('Datatypes', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/buer.sos', 'utf8');
        //this.parser.sosi_types = undefined;

        //this.types = _.clone(datatypes);
    });

    after(function () {
        // runs after all tests in this block
    });

    //TODO: find a node-ish way of a lite build
    xit('should not use datatypes.js if not window.SOSI.types is defined', function () {
        var sosidata = parser.parse(data);
        var bue26 = sosidata.features.getById(26);
        assert.equals(bue26.attributes.OPPDATERINGSDATO, '20130531092024');
    });

    it('should convert OPPDATERINGSDATO to oppdateringsdato and display as date', function () {
        var sosidata = parser.parse(data);
        var bue26 = sosidata.features.getById(26);
        assert.equals(bue26.attributes.oppdateringsdato, new Date(2013, 4, 31, 9, 20, 24));
    });
});
