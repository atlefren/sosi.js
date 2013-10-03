var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    var Head = ns.Base.extend({
        initialize: function (data) {
            this.data = data;
        }
    });

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var Data = ns.Base.extend({
        initialize: function (elements) {
            this.elements = elements;
        },

        length: function () {
            return _.keys(this.elements).length;
        }

    });

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new Head(data["HODE"]);
            this.def = new Def(data["DEF"]);
            this.objdef = new Objdef(data["OBJDEF"]);
            this.data = new Data(_.omit(data, ["HODE", "DEF", "OBJDEF", "SLUTT"]));
        }
    });

    function numDots(str) {
        var stop = false;
        return _.reduce(str, function(count, character) {
            if (character === "." && !stop) {
                count++;
            } else {
                stop = true;
            }
            return count;
        }, 0)
    }

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            var parent;
            var res =_.reduce(data.split("\n"), function (res, line) {
                if (line[0] && line[0] !== "!") {
                    if (numDots(line) === 1) {
                        var s = line.replace(".", "");
                        var key = s.substring(0, s.indexOf('!')).replace(/\s\s*$/, '');
                        res[key] = [];
                        parent = key;
                    } else if(parent){
                        res[parent].push(line);
                    }
                }
                return res;
            }, {});

            return new SosiData(res);
        }
    });


}(SOSI));