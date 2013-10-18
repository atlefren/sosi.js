var SOSIDemo = window.SOSIDemo || {};

(function (ns, undefined) {
    "use strict";

    var Form = Backbone.View.extend({

        tagName: "form",

        template: $("#sosiform").html(),

        events: {
            "submit": "submit"
        },

        initialize: function () {
            _.bindAll(this, "submit");
        },

        render: function () {
            this.$el.html(_.template(this.template));
            return this;
        },

        submit: function () {
            var data = this.$("#sosidata").val();
            this.trigger("submit", data);
            return false;
        }
    });

    function formatPopup(properties, indent) {
        indent = typeof indent !== 'undefined' ? indent : 0;
        return "<div style='margin-left:" + indent + "mm'>" +
            _.map(properties, function (value, key) {
                if (value instanceof Date) {      // treat objects one by one for now...
                    return key + ": " + value.getFullYear() + "-" + value.getMonth() + 1 + "-" + value.getDate();
                } else if (_.isObject(value)) { // breaks for actual objects as value, e.g. Date
                    return key + ":<br/>" + formatPopup(value, indent + 5);
                }
                return key + ": " + value;
            }).join("<br/>") +
            "</div>";
    }

    ns.Menu = Backbone.View.extend({

        className: "menu panel panel-default",

        template: $("#menu-panel-template").html(),

        events: {
            "click .glyphicon-resize-small": "minimize",
            "click .glyphicon-resize-full": "maximize"
        },

        initialize: function () {
            this.map = this.options.map;
            this.form = new Form();
            this.form.on("submit", this.parseSosi, this);
            this.sosiparser = new SOSI.Parser();
            _.bindAll(this, "minimize", "maximize");
        },

        render: function () {
            this.$el.html(_.template(this.template));
            this.$(".content").append(this.form.render().$el);
            return this;
        },

        parseSosi: function (sosidata) {
            if (this.layer) {
                this.layer.clearLayers();
            }
            this.$el.find(".alert").remove();
            //try {
                var json = this.sosiparser.parse(sosidata).dumps("geojson");
                $("#jsondata")[0].innerText = JSON.stringify(json);
                var layer = L.Proj.geoJson(
                    json,
                    {
                        "onEachFeature": function (featureData, layer) {
                            layer.bindPopup(formatPopup(featureData.properties));
                        }
                    }
                ).addTo(this.map);

                this.map.fitBounds(layer.getBounds());
                this.layer = layer;
                this.minimize();

            //} catch (error) {
            //    this.showError(error);
            //}
        },

        showError: function (error) {
            this.$(".content").append('<div class="alert alert-danger">' + error + '</div>');
        },

        minimize: function () {
            this.$el.addClass("min");
            this.$(".content").hide();
            this.$(".resize").removeClass("glyphicon-resize-small").addClass("glyphicon-resize-full");
        },

        maximize: function () {
            this.$el.removeClass("min");
            this.$(".content").show();
            this.$(".resize").removeClass("glyphicon-resize-full").addClass("glyphicon-resize-small");
        }
    });

}(SOSIDemo));
