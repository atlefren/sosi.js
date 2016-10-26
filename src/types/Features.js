'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Feature = require('../types/Feature');
var mappings = require('../util/mappings');

var Features = Base.extend({

    initialize: function (elements, head) {
        this.exclude = [];
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

    filter: function (filterFunc, scope) {
        //_.each(this.features, this.ensureGeom, this);
        //this.features = _.filter(this.features, filterFunc, scope);
        filterFunc = _.bind(filterFunc, scope);
        this.exclude = _.compact(_.map(this.features, function (feature) {
            if (!filterFunc(feature)) {
                return feature.id;
            }
        }));
    },

    mapAttributes: function (mapFunction, scope) {
        mapFunction = _.bind(mapFunction, scope);
        this.features = _.reduce(this.features, function (acc, feature, key) {
            if (this.exclude.indexOf(feature.id) < 0) {
                feature.exposedAttributes = mapFunction(feature.attributes);
            }
            acc[key] = feature;
            return acc;
        }, {}, this);
    },

    at: function (i) {
        var index = _.difference(this.index, this.exclude);
        return this.getById(index[i]);
    },

    getById: function (id) {
        if (this.exclude.indexOf(id) > -1) {
            return undefined;
        }
        return this._getById(id);
    },

    _getById: function (id) {
        return this.ensureGeom(this.features[id]);
    },

    all: function (ordered) {
        return this._all(ordered, true);
    },

    _all: function (ordered, exclude) {
        if (ordered) {
            /* order comes at a 25% performance loss */
            var ids = exclude ? _.difference(this.index, this.exclude) : this.index;
            return _.map(ids, this.getById, this);
        } else {
            return _.chain(this.features)
            .filter(function (feature) {
                if (!exclude) {
                    return true;
                }
                return this.exclude.indexOf(feature.id) < 0;
            }, this)
            .map(this.ensureGeom, this)
            .map(function (feature) {
                feature.attributes = feature.exposedAttributes || feature.attributes;
                return feature;
            })
            .value();
        }
    }
});

module.exports = Features;
