'use strict';

var _ = require('underscore');
var Base = require('../class/Base');

function createPolygon(refs, features) {
    var flate =  _.flatten(_.map(refs, function (ref) {
        var id = Math.abs(ref);
        var kurve = features.getById(id);
        if (!kurve) {
            throw new Error('Fant ikke KURVE ' + id + ' for FLATE');
        }
        var geom = kurve.geometry.kurve;
        if (ref < 0) {
            geom = _.clone(geom).reverse();
        }
        return _.initial(geom);
    }));
    flate.push(flate[0]);
    return flate;
}

function parseRefs(refs) {
    return _.map(refs.trim().split(' '), function (ref) {
        return parseInt(ref.replace(':', ''), 10);
    });
}

var Polygon = Base.extend({
        initialize: function (refs, features, srs) {
            var shell = refs;
            var holes = [];
            var index = refs.indexOf('(');
            this.srs = srs;
            if (index !== -1) {
                shell = refs.substr(0, index);
                holes = refs.substr(index, refs.length);
            }

            shell = parseRefs(shell);
            holes = _.map(
                _.reduce(holes, function (result, character) {
                    if (character === '(') {
                        result.push('');
                    } else if (character !== ')' && character !== '') {
                        result[result.length - 1] += character;
                    }
                    return result;
                }, []),
                parseRefs
            );

            this.flate = createPolygon(shell, features);

            this.holes = _.map(holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(Math.abs(hole[0]));
                    if (feature.geometryType === 'FLATE') {
                        return feature.geometry.flate;
                    }
                }
                return createPolygon(hole, features);
            });
            this.shellRefs = shell;
            this.holeRefs = holes;
        },

        transform: function (to) {
            this.flate = _.map(this.flate, function (line) {
                return line.transform(to);
            });
            this.srs = to;
            return this;
        }
    });

module.exports = Polygon;
