'use strict';

function round(number, numDecimals) {
    var pow = Math.pow(10, numDecimals);
    return Math.round(number * pow) / pow;
}

module.exports = round;
