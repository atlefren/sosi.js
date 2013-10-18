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
            assert.equals(flate.attributes.KVALITET.målemetode, NaN);


 

        }
    });
}(SOSI));
