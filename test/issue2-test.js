(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Test issue #2', {
        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/testfile2.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should be able to read attributes": function () {
            var sosidata = this.parser.parse(this.sosidata);
            assert(sosidata.features.all());

            var flate = sosidata.features.getById(5);
            assert.equals(flate.attributes.kvalitet.målemetode, NaN);
        },

        "should be able to get KURVE 606": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var kurve606 = sosidata.features.getById(606);
            assert(kurve606);
        },

        //test issue 20
        "should be able to write to TopoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var name = "testdata";
            var json =  sosidata.dumps("topojson", name);
            assert(json);
        },

        //test issue 20
        "should be able to write to GeoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var name = "testdata";
            var json =  sosidata.dumps("geojson", name);
            assert(json);
        }

    });
}(SOSI));
