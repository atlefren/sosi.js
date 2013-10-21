(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Grouped attributes test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/fastmerke.sos",
                success: _.bind(function (data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should read fastmerke.sos": function () {

            var sosidata = this.parser.parse(this.sosidata);
            assert(sosidata.hode);
            assert(sosidata.def);
            assert(sosidata.objdef);
            assert(sosidata.features);

            assert(sosidata.features.length(), 1);


            var fastmerke = sosidata.features.getById(1);
            assert(fastmerke);
            assert.equals(fastmerke.attributes.kvalitet.synbarhet, NaN);
            assert.equals(fastmerke.attributes.fastmerkeSentrumRef, "TB");
            assert.equals(fastmerke.attributes.fastmerkeType.fastmerkeUnderlag, 1);
            assert.equals(fastmerke.attributes.høydeOverBakken, 0.02);
            assert(fastmerke.attributes.punktBeskrivelse.match(/BIL\.$/));
        }


    });
}(SOSI));
