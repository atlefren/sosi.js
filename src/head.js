var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function getString(data, key) {
        var str = data[key] || "";
        return str.replace(/"/g, "");
    }

    function getNumber(data, key) {
        return parseFloat(data[key]);
    }

    function getSrid(koordsys) {
        koordsys = parseInt(koordsys, 10);
        if (ns.koordsysMap[koordsys]) {
            return ns.koordsysMap[koordsys].srid;
        }
        throw new Error("KOORDSYS = " + koordsys + " not found!");
    }

    function getSridFromGeosys(geosys) {
        if (_.isArray(geosys)) {
            throw new Error("GEOSYS cannot be parsed in uncompacted form yet.");
        } else {
            geosys = geosys.split(/\s+/);
        }
        if (ns.geosysMap[geosys[0]]) {
            return ns.geosysMap[geosys[0]].srid;
        }
        throw new Error("GEOSYS = " + geosys + " not found!");
    }

    function parseBbox(data) {
        var ll = data["MIN-NØ"].split(/\s+/);
        var ur = data["MAX-NØ"].split(/\s+/);
        return [
            parseFloat(ll[1]),
            parseFloat(ll[0]),
            parseFloat(ur[1]),
            parseFloat(ur[0])
        ];
    }

    function parseOrigo(data) {
        data = _.filter(data.split(/\s+/), function (element) {
            return element !== "";
        });
        return {
            "x": parseFloat(data[1]),
            "y": parseFloat(data[0])
        };
    }

    function parseUnit(data) {
        if (data.TRANSPAR.enhet) {
            return parseFloat(data.TRANSPAR.enhet);
        }
        return parseFloat(data.TRANSPAR.ENHET);
    }

    ns.Head = ns.Base.extend({
        initialize: function (data) {
            this.setData(data);
        },

        parse: function (data) {
            return ns.util.parseFromLevel2(data);
        },

        setData: function (data) {
            data = this.parse(data);
            this.eier = getString(data, ns.util.getLongname("EIER"));
            this.produsent = getString(data, ns.util.getLongname("PRODUSENT"));
            this.objektkatalog = getString(data, "OBJEKTKATALOG");
            this.verifiseringsdato = data[ns.util.getLongname("VERIFISERINGSDATO")];
            this.version = getNumber(data, ns.util.getLongname("SOSI-VERSJON"));
            this.level = getNumber(data, ns.util.getLongname("SOSI-NIVÅ"));
            if (!!SOSI.types) {
                this.kvalitet = ns.util.specialAttributes[ns.util.getLongname("KVALITET")].createFunction(data[ns.util.getLongname("KVALITET")]);
            } else {
                this.kvalitet = getString(data, ns.util.getLongname("KVALITET"));
            }
            this.bbox = parseBbox(data["OMRÅDE"]);
            this.origo = parseOrigo(data["TRANSPAR"]["ORIGO-NØ"]);
            this.enhet = parseUnit(data);
            this.vertdatum = getString(data["TRANSPAR"], "VERT-DATUM");
            if (data["TRANSPAR"]["KOORDSYS"]) {
                this.srid = getSrid(data["TRANSPAR"]["KOORDSYS"]);
            } else {
                this.srid = getSridFromGeosys(data["TRANSPAR"]["GEOSYS"]);
            }
        }
    });

}(SOSI));
