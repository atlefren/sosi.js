var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Base = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(ns.Base.prototype, {
        initialize: function () {}
    });

    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }
            _.extend(child, parent, staticProps);
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
            if (protoProps) _.extend(child.prototype, protoProps);
        child.__super__ = parent.prototype;

        return child;
    };

    ns.Base.extend = extend;
}(SOSI));