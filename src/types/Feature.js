'use strict';
var _ = require('underscore');
var Base = require('../class/Base');

var Point = require('../geometry/Point');
var LineString = require('../geometry/LineString');
var LineStringFromArc = require('../geometry/LineStringFromArc');
var Polygon = require('../geometry/Polygon');

var parseFromLevel2 = require('../util/parseFromLevel2');
var specialAttributes = require('../util/specialAttributes');

function createGeometry(geometryType, lines, origo, unit, srs) {

    var geometryTypes = {
        'PUNKT': Point,
        // a point feature with exsta styling hints - the geometry actually consists of up to three points
        'TEKST': Point,
        'KURVE': LineString,
        'BUEP': LineStringFromArc,
        'LINJE': LineString, // old 4.0 name for unsmoothed KURVE
        'FLATE': Polygon
    };

    if (!geometryTypes[geometryType]) {
        throw new Error('GeometryType ' + geometryType + ' is not handled (yet..?)');
    }
    return new geometryTypes[geometryType](lines, origo, unit, srs);
}

function endsWith(string, expr) {
    if (!string) {
        return false;
    }
    return string.length >= expr.length && string.substr(string.length - expr.length) === expr;
}


var Feature = Base.extend({

    initialize: function (data, origo, unit, features) {
        if (data.id === undefined || data.id === null) {
            throw new Error('Feature must have ID!');
        }
        this.id = data.id;
        this.parseData(data, origo, unit, features);
        this.geometryType = data.geometryType;
    },

    parseData: function (data, origo, unit) {

        var split = _.reduce(data.lines, function (dict, line) {
            if (endsWith(line, '..NØ') || endsWith(line, '..NØH')) {
                dict.foundGeom = true;
            }
            if (dict.foundGeom) {
                dict.geom.push(line);
            } else {
                if (line.indexOf('..REF') !== -1) {
                    dict.foundRef = true;
                    line = line.replace('..REF', '');
                }
                if (dict.foundRef) {
                    if (line[0] === '.') {
                        dict.foundRef = false;
                    } else {
                        dict.refs.push(line);
                    }
                } else {
                    dict.attributes.push(line);
                }
            }
            return dict;
        }, {
            'attributes': [],
            'geom': [],
            'refs': [],
            'foundGeom': false,
            'foundRef': false
        });


        this.attributes = parseFromLevel2(split.attributes);
        this.attributes = _.reduce(this.attributes, function (attrs, value, key) {
            if (!!specialAttributes && specialAttributes[key]) {
                attrs[key] = specialAttributes[key].createFunction(value);
            } else {
                attrs[key] = value;
            }
            return attrs;
        }, {});

        if (split.refs.length > 0) {
            this.attributes.REF = split.refs.join(' ');
        }
        if (this.attributes.ENHET) {
            unit = parseFloat(this.attributes.ENHET);
        }

        this.raw_data = {
            geometryType: data.geometryType,
            geometry: split.geom,
            origo: origo,
            unit: unit
        };
    },

    transform: function (to) {
        this.geometry = this.geometry.transform(to);
        this.srs = to;
        return this;
    },

    buildGeometry: function (features) {
        if (this.raw_data.geometryType === 'FLATE') {
            this.geometry = new Polygon(this.attributes.REF, features, features.srs);
            this.geometry.center = new Point(
                this.raw_data.geometry,
                this.raw_data.origo,
                this.raw_data.unit,
                features.srs
            );
            this.attributes = _.omit(this.attributes, 'REF');
        } else {
            this.geometry = createGeometry(
                this.raw_data.geometryType,
                this.raw_data.geometry,
                this.raw_data.origo,
                this.raw_data.unit,
                features.srs
            );
        }
        this.raw_data = null;
    }
});

module.exports = Feature;
