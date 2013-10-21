(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Real life test', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/naturvernomraade.sos",
                success: _.bind(function (data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "should read naturvernomraade.sos": function () {

            var sosidata = this.parser.parse(this.sosidata);
            assert(sosidata.hode);
            assert(sosidata.def);
            assert(sosidata.objdef);
            assert(sosidata.features);

            assert(sosidata.features.length(), 127);
            assert.equals(sosidata.hode.eier, "Direktoratet for naturforvaltning");


            var flate_50 = sosidata.features.getById(50);

            assert(flate_50.attributes.identifikasjon, "VV00000688");
            assert(flate_50.attributes.navn, "Gaulosen");
        }


    });
}(SOSI));
