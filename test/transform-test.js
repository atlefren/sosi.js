'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var Point = require('../src/geometry/Point');
var LineString = require('../src/geometry/LineString');
var Polygon = require('../src/geometry/Polygon');
var fs = require('fs');

function round(num, decimals) {
    var pow = Math.pow(10, decimals);
    return Math.round(num * pow) / pow;
}

describe('transform', function () {
    var parser;

    before(function () {
        parser = new SOSI.Parser();
    });

   it('should be able to read and transform point', function () {
        var sosidata = parser
            .parse(fs.readFileSync('./data/fastmerke.sos', 'utf8'))
            .transform('EPSG:4326');
        var feature1 = sosidata.features.at(0);
        assert(feature1.geometry instanceof Point);
        assert.equals(feature1.geometry.x, 8.207897925099038);
        assert.equals(feature1.geometry.y, 60.92284189022829);
    });

    it('should be able to read and transform line', function () {
        var sosidata = parser
            .parse(fs.readFileSync('./data/kurvetest.sos', 'utf8'))
            .transform('EPSG:4326');
        var feature1 = sosidata.features.at(0);
        assert(feature1.geometry instanceof LineString);
        var kurve = feature1.geometry.kurve;
        assert.equals(kurve.length, 10);
        assert.equals(kurve[0].x, 17.058327126324247);
        assert.equals(kurve[0].y, 58.90096239107757);
        assert.equals(kurve[9].x, 17.058328013090527);
        assert.equals(kurve[9].y, 58.900966339912564);

        var knutepunkter = feature1.geometry.knutepunkter;
        assert.equals(knutepunkter.length, 1);
        assert.equals(knutepunkter[0].knutepunktkode, 1);
        assert.equals(knutepunkter[0].x, 17.05832903647164);
        assert.equals(knutepunkter[0].y, 58.90096274766714);
    });

    it('should be able to read and transform bue', function () {

        var sosidata = parser
            .parse(fs.readFileSync('./data/buer.sos', 'utf8'))
            .transform('EPSG:4326');
        assert(sosidata.features.length(), 127);

        var bue26 = sosidata.features.getById(26);
        assert(bue26);
        assert.equals(bue26.geometry.kurve.length, 56);
        assert.equals(bue26.geometry.kurve[0].x, 8.525817988847617);
        assert.equals(bue26.geometry.kurve[0].y, 60.86153025301907);
    });

    it('should be able to read and transform flate', function () {
        var sosidata = parser
            .parse(fs.readFileSync('./data/flatetest.sos', 'utf8'))
            .transform('EPSG:4326');
        var flate = sosidata.features.getById(651);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 9);

        assert.equals(flate.geometry.flate[0].x, 23.03965504554524);
        assert.equals(flate.geometry.flate[0].y, 69.01684794588947);
        assert.equals(flate.geometry.flate[0].z, 368.15);

        assert.equals(flate.geometry.flate[1].x, 23.039475899856622);
        assert.equals(flate.geometry.flate[1].y, 69.01688916566819);

        assert.equals(flate.geometry.flate[2].x, 23.03947541673263);
        assert.equals(flate.geometry.flate[2].y, 69.01688906463308);

        //...

        assert.equals(flate.geometry.flate[8].x, 23.03965504554524);
        assert.equals(flate.geometry.flate[8].y, 69.01684794588947);
    });

    it('should be able to read and transform point forwards and backwards', function () {
        var sosidata = parser
            .parse(fs.readFileSync('./data/fastmerke.sos', 'utf8'))
            .transform('EPSG:4326')
            .transform('EPSG:32632');
        var feature1 = sosidata.features.at(0);
        assert(feature1.geometry instanceof Point);
        assert.equals(round(feature1.geometry.x, 3), 457055.342);
        assert.equals(round(feature1.geometry.y, 3), 6754452.623);
    });

});
