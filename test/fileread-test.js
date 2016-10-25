'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var fs = require('fs');
var datatypes = require('../src/util/datatypes');


describe('Datatypes', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
    });

    after(function () {
        // runs after all tests in this block
    });


    it('should be able to read utf-8 buffer', function () {
        var data = fs.readFileSync('./data/non-linear.sos');
        var sosidata = parser.parse(data);
        assert(sosidata);
    });

    it('should be able to read DOSN8 buffer', function () {
        var data = fs.readFileSync('./data/valgkretserdos8.SOS');

        var sosidata = parser.parse(data);
        assert(sosidata);
    });

    it('should be able to read ANSI buffer', function () {
        var data = fs.readFileSync('./data/valgkretseransi.SOS');

        var sosidata = parser.parse(data);
        assert(sosidata);
    });

    it('should be able to read ISO8859-10 buffer', function () {
        var data = fs.readFileSync('./data/valgkretser_ISO8859-10.SOS');

        var sosidata = parser.parse(data);
        assert(sosidata);
    });

    //TODO: Find proper ISO8859-1 sos-file
    xit('should be able to read ISO8859-1 buffer', function () {
        var data = fs.readFileSync('./data/valgkretser_ISO8859-1.SOS');

        var sosidata = parser.parse(data);
        assert(sosidata);
    });

});
