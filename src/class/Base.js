'use strict';
var _ = require('underscore');

/**
 * This is adopted from backbone.js which
 * is available for use under the MIT software license.
 * see http://github.com/jashkenas/backbone/blob/master/LICENSE
 */

var Base = function () {
    this.initialize.apply(this, arguments);
};

_.extend(Base.prototype, {
    initialize: function () {}
});

Base.extend = function (protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () { return parent.apply(this, arguments); };
    }
        _.extend(child, parent, staticProps);
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
    if (protoProps) {
        _.extend(child.prototype, protoProps);
    }
    child.__super__ = parent.prototype;

    return child;
};

module.exports = Base;
