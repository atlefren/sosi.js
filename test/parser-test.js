'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var fs = require('fs');

describe('SOSI.Parser', function () {
    var parser,
        sosidata;

    before(function () {
        parser = new SOSI.Parser();
        var data = fs.readFileSync('./data/testfile1.sos', 'utf8');
        sosidata = parser.parse(data);
    });

    it('should be defined', function () {
        assert(SOSI.Parser);
    });

    it('should be initializeable', function () {
        assert(parser);
    });

    it('should be have a parse method', function () {
        assert(parser.parse);
        assert(_.isFunction(parser.parse));
    });

    it('should be able to parse data', function () {
        assert(sosidata);
        assert(sosidata.hode);
        assert(sosidata.def);
        assert(sosidata.objdef);
        assert(sosidata.features);
        assert.equals(sosidata.features.length(), 5);
    });

    it('should read header', function () {
        assert.equals(sosidata.hode.eier, 'Statens kartverk');
        assert.equals(sosidata.hode.produsent, 'SØRKART A/S');
        assert.equals(sosidata.hode.objektkatalog, 'Eksempel 4.5');
        assert.equals(sosidata.hode.verifiseringsdato, new Date(1989, 5, 23));
        assert.equals(sosidata.hode.version, 4.5);
        assert.equals(sosidata.hode.level, 5);
        assert.equals(sosidata.hode.vertdatum, 'NN54 SJØ0');
    });

    it('should get kvalitet', function () {
        assert(sosidata.hode.kvalitet);
        assert.equals(sosidata.hode.kvalitet.målemetode, 11);
        assert.equals(sosidata.hode.kvalitet.nøyaktighet, 300);
    });

    it('should get bounds', function () {
        assert(sosidata.hode.bbox);
        assert.equals(sosidata.hode.bbox, [10000, 100000, 13200, 102400]);
    });

    it('should get origo', function () {
        assert(sosidata.hode.origo);
        assert.equals(sosidata.hode.origo.x, 10000);
        assert.equals(sosidata.hode.origo.y, 100000);
    });

    it('should get enhet', function () {
        assert.equals(sosidata.hode.enhet, 0.01);
    });

    it('should get srid', function () {
        assert.equals(sosidata.hode.srid, 'EPSG:27395');
    });

});

