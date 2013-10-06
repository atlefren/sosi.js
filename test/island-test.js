(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Island test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/flate_oy.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should read outer ring": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var flate = sosidata.features.getById(400);
            assert(flate.geometry instanceof ns.Polygon);

            assert.equals(flate.geometry.flate.length, 5);

            assert.equals(flate.geometry.flate[0].x, 300000);
            assert.equals(flate.geometry.flate[0].y, 7000000);

            assert.equals(flate.geometry.flate[1].x, 300000);
            assert.equals(flate.geometry.flate[1].y, 7001000);

            assert.equals(flate.geometry.flate[2].x, 301000);
            assert.equals(flate.geometry.flate[2].y, 7001000);

            assert.equals(flate.geometry.flate[3].x, 301000);
            assert.equals(flate.geometry.flate[3].y, 7000000);

            assert.equals(flate.geometry.flate[4].x, 300000);
            assert.equals(flate.geometry.flate[4].y, 7000000);

        },

        "should read the ploygon that describes the inner ring": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var flate = sosidata.features.getById(500);
            assert(flate.geometry instanceof ns.Polygon);

            assert.equals(flate.geometry.flate.length, 5);

            assert.equals(flate.geometry.flate[0].x, 300010);
            assert.equals(flate.geometry.flate[0].y, 7000010);

            assert.equals(flate.geometry.flate[1].x, 300010);
            assert.equals(flate.geometry.flate[1].y, 7000020);

            assert.equals(flate.geometry.flate[2].x, 300020);
            assert.equals(flate.geometry.flate[2].y, 7000020);

            assert.equals(flate.geometry.flate[3].x, 300020);
            assert.equals(flate.geometry.flate[3].y, 7000010);

            assert.equals(flate.geometry.flate[4].x, 300010);
            assert.equals(flate.geometry.flate[4].y, 7000010);
        },

        "should read island described as another FLATE": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var flate = sosidata.features.getById(400);
            assert(flate.geometry instanceof ns.Polygon);

            assert.equals(flate.geometry.flate.length, 5);
            assert.equals(flate.geometry.islands.length, 1);

            var island = flate.geometry.islands[0];
            assert.equals(island.length, 5);
            assert.equals(island[0].x, 300010);
            assert.equals(island[0].y, 7000010);

            assert.equals(island[1].x, 300010);
            assert.equals(island[1].y, 7000020);

            assert.equals(island[2].x, 300020);
            assert.equals(island[2].y, 7000020);

            assert.equals(island[3].x, 300020);
            assert.equals(island[3].y, 7000010);

            assert.equals(island[4].x, 300010);
            assert.equals(island[4].y, 7000010);
        },

        "should read island described by KURVE": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var flate = sosidata.features.getById(600);
            assert(flate.geometry instanceof ns.Polygon);

            assert.equals(flate.geometry.flate.length, 5);
            assert.equals(flate.geometry.islands.length, 1);

            var island = flate.geometry.islands[0];

            assert.equals(island.length, 5);
            assert.equals(island[0].x, 300010);
            assert.equals(island[0].y, 7000010);

            assert.equals(island[1].x, 300010);
            assert.equals(island[1].y, 7000020);

            assert.equals(island[2].x, 300020);
            assert.equals(island[2].y, 7000020);

            assert.equals(island[3].x, 300020);
            assert.equals(island[3].y, 7000010);

            assert.equals(island[4].x, 300010);
            assert.equals(island[4].y, 7000010);
        },

        "should be able to write to geoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var json =  sosidata.dumps("geojson");
            assert(json);

            assert.equals(json.type, "FeatureCollection");
            assert.equals(json.features.length, 11);

            var feature1 = json.features[10];

            assert.equals(feature1.type, "Feature");
            assert.equals(feature1.id, 600);
            assert.equals(feature1.properties["OBJTYPE"], "Mahogney");

            assert.equals(feature1.properties.kvalitet.maalemetode, 82);

            var geom = feature1.geometry;
            assert.equals(geom.type, "Polygon");
            assert.equals(geom.coordinates.length, 2);

            assert.equals(geom.coordinates[0].length, 5);
            assert.equals(geom.coordinates[1].length, 5);

            assert.equals(geom.coordinates[0][0][0], 300000);
            assert.equals(geom.coordinates[0][0][1], 7000000);

            assert.equals(geom.coordinates[1][0][0], 300010);
            assert.equals(geom.coordinates[1][0][1], 7000010);
        }
    });
}(SOSI));