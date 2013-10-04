(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('FLATE test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/flatetest.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should be able to read attributes": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var feature1 = sosidata.features.at(4);
            assert.equals(feature1.attributes["OBJTYPE"], "Tank");

            assert.equals(feature1.attributes.kvalitet.maalemetode, 82);
            assert.equals(feature1.attributes["REGISTRERINGSVERSJON"], '"FKB" "3.4 eller eldre"');
        },


        "should be able to read geometry": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var flate = sosidata.features.at(4);
            assert(flate.geometry instanceof ns.Polygon);

            assert.equals(flate.geometry.flate.length, 9);

            assert.equals(flate.geometry.flate[0].x, 341824.03);
            assert.equals(flate.geometry.flate[0].y, 7661347.45);

            assert.equals(flate.geometry.flate[1].x, 341817.18);
            assert.equals(flate.geometry.flate[1].y, 7661352.50);

            assert.equals(flate.geometry.flate[2].x, 341817.16);
            assert.equals(flate.geometry.flate[2].y, 7661352.49);

            assert.equals(flate.geometry.flate[3].x, 341817.23);
            assert.equals(flate.geometry.flate[3].y, 7661353.33);

            assert.equals(flate.geometry.flate[4].x, 341820.91);
            assert.equals(flate.geometry.flate[4].y, 7661356.85);

            assert.equals(flate.geometry.flate[5].x, 341826.38);
            assert.equals(flate.geometry.flate[5].y, 7661351.01);

            assert.equals(flate.geometry.flate[6].x, 341826.90);
            assert.equals(flate.geometry.flate[6].y, 7661350.95);

            assert.equals(flate.geometry.flate[7].x, 341826.78);
            assert.equals(flate.geometry.flate[7].y, 7661350.28);

            assert.equals(flate.geometry.flate[8].x, 341824.03);
            assert.equals(flate.geometry.flate[8].y, 7661347.45);
        },

        "should be able to write to geoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var json =  sosidata.dumps("geojson");
            assert(json);

            assert.equals(json.type, "FeatureCollection");
            assert.equals(json.features.length, 5);

            var feature1 = json.features[4];

            assert.equals(feature1.type, "Feature");
            assert.equals(feature1.properties["OBJTYPE"], "Tank");
            assert.equals(feature1.properties.kvalitet.maalemetode, 82);


            var geom = feature1.geometry;
            assert.equals(geom.type, "Polygon");
            assert.equals(geom.coordinates[0].length, 9);

            assert.equals(geom.coordinates[0][0][0], 341824.03);
            assert.equals(geom.coordinates[0][0][1], 7661347.45);
            assert.equals(geom.coordinates[0][8][0], 341824.03);
            assert.equals(geom.coordinates[0][8][1], 7661347.45);

        }


        });
}(SOSI));