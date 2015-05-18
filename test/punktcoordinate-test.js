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
        }
    });
}(SOSI));
