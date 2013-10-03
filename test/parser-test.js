(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('SOSIPARSERTEST', {

        setUp: function () {

            $.ajax({
                async: false,
                url: buster.env.contextPath + "/testfile1.sos",
                success:_.bind(function(data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
        },

        "SOSI.Parser should be defined": function () {
            assert(ns.Parser);
        },

        "should read a sosi-file": function () {
            var sosidata = this.parser.parse(this.sosidata);
            assert(sosidata.hode);
            assert(sosidata.def);
            assert(sosidata.objdef);
            assert(sosidata.data);
            assert.equals(sosidata.data.length(), 8);
        }

    });

}(SOSI));