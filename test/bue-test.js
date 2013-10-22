(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Arc test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/buer.sos",
                success: _.bind(function (data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should read bue.sos": function () {

            var sosidata = this.parser.parse(this.sosidata);
            assert(sosidata.hode);
            assert(sosidata.def);
            assert(sosidata.objdef);
            assert(sosidata.features);
            assert(sosidata.features.length(), 127);

            var bue26 = sosidata.features.getById(26);
            assert(bue26);
            assert.equals(bue26.geometry.kurve.length, 56);
        },

        "buer have joints": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var bue26 = sosidata.features.getById(26);
            assert.equals(bue26.geometry.knutepunkter.length, 2);
            assert.equals(bue26.geometry.knutepunkter[1].x, 474237.85);
        },

        "should be able to write to GeoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var name = "testdata";
            var json =  sosidata.dumps("geojson", name);
            assert(json);
        },

        "should be able to write to TopoJSON": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var name = "testdata";
            var json =  sosidata.dumps("topojson", name);
            assert(json);
        }

    });
}(SOSI));
