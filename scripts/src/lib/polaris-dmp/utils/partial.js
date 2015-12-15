function partial() {
    var fn = Array.prototype.slice.call(arguments)[0];
    var args = Array.prototype.slice.call(arguments, 1);

    if (fn && (typeof fn.apply !== 'function')) {
        throw new Error('First argument is not a function');
    }

    return function() {
        var newArgs = Array.prototype.slice.call(arguments);
        return fn.apply(this, args.concat(newArgs));
    };
}
