'use strict';
/*eslint-env  mocha */

var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var _ = require('underscore');
var Base = require('../src/class/Base');

describe('class system', function () {
    it('should have a base', function () {
        assert(Base);
    });

    it('should be possible to extend the base', function () {
        var MyObj = Base.extend();
        assert(MyObj);
    });

    it('should be possible initialize an object', function () {
        var MyObj = Base.extend();
        var obj = new MyObj();
        assert(obj);
    });

    it('should be possible to create methods', function () {
        var MyObj = Base.extend({
            f: function () {
                return 'a';
            }
        });
        var obj = new MyObj();
        assert(obj.f);
    });

    it('should be possible to call methods', function () {
        var MyObj = Base.extend({
            f: function () {
                return 'a';
            }
        });
        var obj = new MyObj();
        assert.equals(obj.f(), 'a');
    });
});
