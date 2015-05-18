(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('PUNKT coordinate Test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/punktcoordinate.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "NØH and coordinates on same line": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var feature1 = sosidata.features.at(0);
            assert(feature1.geometry instanceof ns.Point);
            assert.equals(feature1.geometry.x, 10116.68);
            assert.equals(feature1.geometry.y, 100029.8);
        },

        "NØH and coordinates on same line for LineString": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var feature2 = sosidata.features.at(1);
            assert(feature2.geometry instanceof ns.LineString);
            var kurve = feature2.geometry.kurve;
            assert.equals(kurve.length, 9);

            assert.equals(kurve[0].x, 10116.68);
            assert.equals(kurve[0].y, 100029.8);
            assert.equals(kurve[0].z, 9.95);
            assert.equals(kurve[8].x, 10116.75);
            assert.equals(kurve[8].y, 100029.87);
            assert.equals(kurve[8].z, 10.02);
        }
    });
}(SOSI));
