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
        assert.equals(feature1.geometry.x, 8.20789792511639);
        assert.equals(feature1.geometry.y, 60.92284188912798);
    });

    it('should be able to read and transform line', function () {
        var sosidata = parser
            .parse(fs.readFileSync('./data/kurvetest.sos', 'utf8'))
            .transform('EPSG:4326');
        var feature1 = sosidata.features.at(0);
        assert(feature1.geometry instanceof LineString);
        var kurve = feature1.geometry.kurve;
        assert.equals(kurve.length, 10);
        assert.equals(kurve[0].x, 17.058327126324244);
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
        assert.equals(bue26.geometry.kurve[0].x, 8.525817988857975);
        assert.equals(bue26.geometry.kurve[0].y, 60.8615302519184);
    });

    it('should be able to read and transform flate', function () {
        var sosidata = parser
            .parse(fs.readFileSync('./data/flatetest.sos', 'utf8'))
            .transform('EPSG:4326');
        var flate = sosidata.features.getById(651);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 9);

        assert.equals(flate.geometry.flate[0].x, 23.039655045675214);
        assert.equals(flate.geometry.flate[0].y, 69.01684794485304);
        assert.equals(flate.geometry.flate[0].z, 368.15);

        assert.equals(flate.geometry.flate[1].x, 23.0394758999866);
        assert.equals(flate.geometry.flate[1].y, 69.01688916463176);

        assert.equals(flate.geometry.flate[2].x, 23.039475416862608);
        assert.equals(flate.geometry.flate[2].y, 69.01688906359665);

        //...

        assert.equals(flate.geometry.flate[8].x, 23.039655045675214);
        assert.equals(flate.geometry.flate[8].y, 69.01684794485304);
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
