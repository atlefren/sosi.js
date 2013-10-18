(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Test issue #2', {
        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/testfile_issue4.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should be able to read transpar that is not shorthand": function () {
            var sosidata = this.parser.parse(this.sosidata);
            assert.equals(sosidata.hode.srid, "EPSG:32632");
            assert.equals(sosidata.hode.origo.x, 0);
            assert.equals(sosidata.hode.origo.y, 0);
            assert.equals(sosidata.hode.enhet, 0.01);
        },

        "should get repeated values for attributes as a array": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var kurve = sosidata.features.getById(119);

            assert.equals(kurve.attributes.LTEMA.length, 5);
            assert.equals(kurve.attributes.LTEMA[0], "4002");
            assert.equals(kurve.attributes.LTEMA[1], "4003");
            assert.equals(kurve.attributes.LTEMA[2], "4011");
            assert.equals(kurve.attributes.LTEMA[3], "4005");
            assert.equals(kurve.attributes.LTEMA[4], "4019");
        }
    });
}(SOSI));
