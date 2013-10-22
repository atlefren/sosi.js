(function (ns) {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Datatypes test', {

        setUp: function () {
            $.ajax({
                async: false,
                url: buster.env.contextPath + "/buer.sos",
                success: _.bind(function (data) {
                    this.sosidata = data;
                }, this)
            });
            this.parser = new ns.Parser();
            this.parser.sosi_types = undefined;

            this.types = _.clone(ns.types);
        },

        tearDown: function () {
            ns.types = this.types;
        },

        "should not use datatypes.js if not window.SOSI.types is defined": function () {
            ns.types = undefined;
            var sosidata = this.parser.parse(this.sosidata);
            var bue26 = sosidata.features.getById(26);
            assert.equals(bue26.attributes.OPPDATERINGSDATO, "20130531092024");
        },

        "should convert OPPDATERINGSDATO to oppdateringsdato and display as date": function () {
            var sosidata = this.parser.parse(this.sosidata);
            var bue26 = sosidata.features.getById(26);
            assert.equals(bue26.attributes.oppdateringsdato, new Date(2013, 4, 31, 9, 20, 24));
        }
    });
}(SOSI));