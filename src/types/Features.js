'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Feature = require('../types/Feature');
var mappings = require('../util/mappings');

var Features = Base.extend({

    initialize: function (elements, head) {

        this.head = head;
        this.index = [];
        this.srs = mappings.koordsysMap[this.head.koordsys].def;
        this.features = _.object(_.map(elements, function (value, key) {
            key = key.replace(':', '').split(/\s+/);
            var data = {
                id: parseInt(key[1], 10),
                geometryType: key[0],
                lines: _.rest(value),
                srs: this.srs
            };
            this.index.push(data.id);
            return [data.id, new Feature(data, head.origo, head.enhet)];
        }, this));
    },

    ensureGeom: function (feature) {
        if (feature && !feature.geometry) {
            feature.buildGeometry(this);
        }
        return feature;
    },

    transform: function (toSrid) {
        var to = _.find(mappings.koordsysMap, function (value) {
            return value.srid === toSrid;
        });
        if (to.def) {
            if (this.srs === to.def) {
                return;
            }
            this.features = _.reduce(this.features, function (acc, feature, key) {
                acc[key] = this.ensureGeom(feature).transform(to.def);
                return acc;
            }, {}, this);

            this.srs = to;
        } else {
            throw new Error('Unknown toSrid: ' + toSrid);
        }
    },

    length: function () {
        return _.size(this.features);
    },

    at: function (i) {
        return this.getById(this.index[i]);
    },

    getById: function (id) {
        return this.ensureGeom(this.features[id]);
    },

    all: function (ordered) {
        if (ordered) {
            /* order comes at a 25% performance loss */
            return _.map(this.index, this.getById, this);
        } else {
            return _.map(this.features, this.ensureGeom, this);
        }
    }
});

module.exports = Features;
