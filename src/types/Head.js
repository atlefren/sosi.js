'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var mappings = require('../util/mappings');
var getLongname = require('../util/getLongname');
var parseFromLevel2 = require('../util/parseFromLevel2');
var datatypes = require('../util/datatypes');
var specialAttributes = require('../util/specialAttributes');

function getString(data, key) {
    var str = data[key] || '';
    return str.replace(/'/g, '');
}

function getNumber(data, key) {
    return parseFloat(data[key]);
}

function getSrid(koordsys) {
    koordsys = parseInt(koordsys, 10);
    if (mappings.koordsysMap[koordsys]) {
        return mappings.koordsysMap[koordsys].srid;
    }
    throw new Error('KOORDSYS = ' + koordsys + ' not found!');
}

function getSridFromGeosys(geosys) {
    if (_.isArray(geosys)) {
        throw new Error('GEOSYS cannot be parsed in uncompacted form yet.');
    } else {
        geosys = geosys.split(/\s+/);
    }
    if (mappings.geosysMap[geosys[0]]) {
        return mappings.geosysMap[geosys[0]].srid;
    }
    throw new Error('GEOSYS = ' + geosys + ' not found!');
}

function parseBbox(data) {
    var ll = data['MIN-NØ'].split(/\s+/);
    var ur = data['MAX-NØ'].split(/\s+/);
    return [
        parseFloat(ll[1]),
        parseFloat(ll[0]),
        parseFloat(ur[1]),
        parseFloat(ur[0])
    ];
}

function parseOrigo(data) {
    data = _.filter(data.split(/\s+/), function (element) {
        return element !== '';
    });
    return {
        'x': parseFloat(data[1]),
        'y': parseFloat(data[0])
    };
}

function parseUnit(data) {
    if (data.TRANSPAR.enhet) {
        return parseFloat(data.TRANSPAR.enhet);
    }
    return parseFloat(data.TRANSPAR.ENHET);
}

var Head = Base.extend({
    initialize: function (data) {
        this.setData(data);
    },

    parse: function (data) {
        return parseFromLevel2(data);
    },

    setData: function (data) {
        data = this.parse(data);
        this.eier = getString(data, getLongname('EIER'));
        this.produsent = getString(data, getLongname('PRODUSENT'));
        this.objektkatalog = getString(data, 'OBJEKTKATALOG');
        this.verifiseringsdato = data[getLongname('VERIFISERINGSDATO')];
        this.version = getNumber(data, getLongname('SOSI-VERSJON'));
        this.level = getNumber(data, getLongname('SOSI-NIVÅ'));
        if (!!datatypes) {
            this.kvalitet = specialAttributes[getLongname('KVALITET')].createFunction(data[getLongname('KVALITET')]);
        } else {
            this.kvalitet = getString(data, getLongname('KVALITET'));
        }
        this.bbox = parseBbox(data['OMRÅDE']);
        this.origo = parseOrigo(data['TRANSPAR']['ORIGO-NØ']);
        this.enhet = parseUnit(data);
        this.vertdatum = getString(data['TRANSPAR'], 'VERT-DATUM');
        if (data['TRANSPAR']['KOORDSYS']) {
            this.koordsys = data['TRANSPAR']['KOORDSYS'];
            this.srid = getSrid(this.koordsys);
        } else {
            this.koordsys = data['TRANSPAR']['GEOSYS'];
            this.srid = getSridFromGeosys();
        }
    }
});

module.exports = Head;
