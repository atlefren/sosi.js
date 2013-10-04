var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Sosi2GeoJSON = ns.Base.extend({

        initialize: function (sosidata) {
            this.sosidata = sosidata;
        },

        dumps: function () {
            return {
                "type": "FeatureCollection",
                "features": this.getFeatures()
            };
        },

        getFeatures: function () {
            return _.map(this.sosidata.features.all(), this.createGeoJsonFeature, this);
        },

        createGeoJsonFeature: function (sosifeature) {
            return {
                "type": "Feature",
                "properties": sosifeature.attributes,
                "geometry": this.writeGeometry(sosifeature.geometry)
            };
        },

        writeGeometry: function (geom) {
            if (geom instanceof ns.Point) {
                return {
                    "type": "Point",
                    "coordinates": [geom.x, geom.y]
                };
            }
        }
    });



}(SOSI));