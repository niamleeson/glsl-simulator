var Runtime = {};
var vector = require('./vector');
Runtime.vec = vector.vec;
Runtime.Vec2 = vector.Vec2;
Runtime.Vec3 = vector.Vec3;
Runtime.Vec4 = vector.Vec4;

var common = {};

common._evalVec = function() {
    var func = arguments[arguments.length - 1];

    r = Runtime.vec(arguments[0]).cast();
    for (var i = 0; i < arguments[0].dimensions(); i++) {
        var arr = [];
        for (var j = 0; j < arguments.length - 1; j++)
            arr.push(arguments[j].get(i));
        r.set(i, func.apply(this, arr));
    }

    return r;
}

common._extVec = function(x, ref) {
    if (x instanceof Runtime.vec)
        return x;

    switch (ref.dimensions()) {
    case 2: return Runtime.Vec2(x);
    case 3: return Runtime.Vec3(x);
    case 4: return Runtime.Vec4(x);
    default:
    }

    return x;
}

common.abs = function(x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, arguments.callee);
    return x >= 0 ? x : -x;
}

common.sign = function(x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, arguments.callee);
    if (x == 0) return 0;
    return x > 0 ? 1 : -1;
}

common.floor = function(x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, arguments.callee);
    return Math.floor(x);
}

common.ceil = function(x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, arguments.callee);
    return Math.ceil(x);
}

common.fract = function(x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, arguments.callee);
    return x - this.floor(x);
}

common.mod = function(x, y) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, this._extVec(y, x), arguments.callee);
    return x - Math.floor(x / y) * y;
}

common.min = function(x, y) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, this._extVec(y, x), arguments.callee);
    return x < y ? x : y;
}

common.max = function(x, y) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, this._extVec(y, x), arguments.callee);
    return x > y ? x : y;
}

common.clamp = function(x, minVal, maxVal) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, this._extVec(minVal, x), this._extVec(maxVal, x), arguments.callee);
    if (minVal > maxVal)
        console.error("[error] minVal is larger than maxVal.");
    return this.min(this.max(x, minVal), maxVal);
}

common.mix = function(x, y, alpha) {
    if (x instanceof Runtime.vec)
        return this._evalVec(x, y, this._extVec(alpha, x), arguments.callee);
    if (alpha < 0 || alpha > 1)
        console.error("[error] alpha should be within range [0, 1].");
    return alpha * x + (1 - alpha) * y;
}

common.step = function(edge, x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(this._extVec(edge, x), x, arguments.callee);
    return x < edge ? 0 : 1;
}

common.smoothstep = function(edge0, edge1, x) {
    if (x instanceof Runtime.vec)
        return this._evalVec(this._extVec(edge0, x), this._extVec(edge1, x), x, arguments.callee);
    var t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}

module.exports = common;