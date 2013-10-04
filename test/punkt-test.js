(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('PUNKT Test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/punkttest.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should be able to read id": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var feature1 = sosidata.features.at(0);
            assert(feature1);
            assert.equals(feature1.id, 1);
        },

        "should be able to read attributes": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var feature1 = sosidata.features.at(0);
            assert.equals(feature1.attributes["OBJTYPE"], "Fastmerke");
        },

        "should be able to read geometry": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var feature1 = sosidata.features.at(0);
            assert(feature1.geometry instanceof ns.Point);
            assert.equals(feature1.geometry.x, 10023.45);
            assert.equals(feature1.geometry.y, 100234.56);
        },

        "should be able to write to geoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var json =  sosidata.dumps("geojson");
            assert(json);

            assert.equals(json.type, "FeatureCollection");
            assert.equals(json.features.length, 1);

            var feature1 = json.features[0];

            assert.equals(feature1.type, "Feature");
            assert.equals(feature1.id, 1);
            assert.equals(feature1.properties["OBJTYPE"], "Fastmerke");

            var geom = feature1.geometry;
            assert.equals(geom.type, "Point");
            assert.equals(geom.coordinates, [10023.45, 100234.56]);

        }

    });

}(SOSI));