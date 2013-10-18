(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Real life test', {

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
            assert.equals(bue26.attributes.oppdateringsdato, new Date(2013,4,31,9,20,24));
        }


    });
}(SOSI));
