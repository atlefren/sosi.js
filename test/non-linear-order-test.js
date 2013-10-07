(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Non-linear order test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/non-linear.sos",
                success:_.bind(function (data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "Should be able to build a geometry for a KURVE that is defined before the FLATE it consists of": function () {

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

        }

    });
}(SOSI));