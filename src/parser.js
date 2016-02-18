'use strict';

var _ = require('underscore');
var parseTree = require('./util/parseTree');
var Base = require('./class/Base');
var Head = require('./types/Head');
var Features = require('./types/Features');

var Sosi2GeoJSON = require('./dumpers/Sosi2GeoJSON');
var Sosi2TopoJSON = require('./dumpers/Sosi2TopoJSON');

var Def = Base.extend({
});

var Objdef = Base.extend({
});


var dumpTypes = {
    'geojson': Sosi2GeoJSON,
    'topojson': Sosi2TopoJSON
};

var SosiData = Base.extend({
    initialize: function (data) {
        this.hode = new Head(data['HODE'] || data['HODE 0']);
        this.def = new Def(data['DEF']); //Not sure if I will care about this
        this.objdef = new Objdef(data['OBJDEF']); //Not sure if I will care about this
        this.features = new Features(
            _.omit(data, ['HODE', 'HODE 0', 'DEF', 'OBJDEF', 'SLUTT']),
            this.hode
        );
    },

    dumps: function (format) {
        if (dumpTypes[format]) {
            return new dumpTypes[format](this).dumps(_.rest(arguments));
        }
        throw new Error('Outputformat ' + format + ' is not supported!');
    }
});


function splitOnNewline(data) {
    return _.map(data.split('\n'), function (line) {
        if (line.indexOf('!') !== 0) { //ignore comments starting with ! also in the middle of the line
            line = line.split('!')[0];
        }
        return line.replace(/^\s+|\s+$/g, ''); // trim whitespace padding comments and elsewhere
    });
}

var Parser = Base.extend({

    parse: function (data) {
        var split = splitOnNewline(data);
        var tree = parseTree(split, 1);
        return new SosiData(tree);
    },
    getFormats: function () {
        return _.keys(dumpTypes);
    }
});

module.exports = Parser;

/*
var SOSI = window.SOSI || {};

(function (ns, undefined) {
    'use strict';

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var dumpTypes = {
        'geojson': ns.Sosi2GeoJSON,
        'topojson': ns.Sosi2TopoJSON
    };

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new ns.Head(data['HODE'] || data['HODE 0']);
            this.def = new Def(data['DEF']); //Not sure if I will care about this
            this.objdef = new Objdef(data['OBJDEF']); //Not sure if I will care about this
            this.features = new ns.Features(
                _.omit(data, ['HODE', 'HODE 0', 'DEF', 'OBJDEF', 'SLUTT']),
                this.hode
            );
        },

        dumps: function (format) {
            if (dumpTypes[format]) {
                return new dumpTypes[format](this).dumps(_.rest(arguments));
            }
            throw new Error('Outputformat ' + format + ' is not supported!');
        }
    });

    function splitOnNewline(data) {
        return _.map(data.split('\n'), function (line) {
            if (line.indexOf('!') !== 0) { //ignore comments starting with ! also in the middle of the line
                line = line.split('!')[0];
            }
            return line.replace(/^\s+|\s+$/g, ''); // trim whitespace padding comments and elsewhere
        });
    }

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            return new SosiData(ns.util.parseTree(splitOnNewline(data), 1));
        },
        getFormats: function () {
            return _.keys(dumpTypes);
        }
    });
}(SOSI));
*/
