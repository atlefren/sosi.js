(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Test issue #2', {
        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/1001_Hoyde.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should be able to read attributes": function () {
            var sosidata = this.parser.parse(this.sosidata);
            assert.equals(sosidata.hode.srid, "EPSG:32632");
            assert.equals(sosidata.hode.origo.x, 0);
            assert.equals(sosidata.hode.origo.y, 0);
            assert.equals(sosidata.hode.enhet, 0.01);
        }
    });
}(SOSI));
