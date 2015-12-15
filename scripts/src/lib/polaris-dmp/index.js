function parseValue(value) {
    if (!value) {
        return value;
    }

    var array = value.split('|');
    return array.length === 1 ? array[0] : array;
}

var dmpCookieRegexp = /(?:(?:^|.*;\s*)polaris-engine-test\s*\=\s*([^;]*).*$)|^.*$/;

function parseDocumentCookie(documentCookieString) {
    var cookieValueRaw = documentCookieString.match(dmpCookieRegexp)[1];
    var cookieValueDecoded = decodeURIComponent(cookieValueRaw);
    return parseDmpCookie(cookieValueDecoded);
}

function parseDmpCookie(cookie) {
    // clean-up browser cookie string: <encoded-value>; Expires=...; Domain=...
    var map = (cookie || '').split(',').reduce(function(accumulator, mapping) {
        var pair = mapping.split('=');
        var keys = pair[0].split(':');
        var value = parseValue(pair[1]);

        if (keys[1]) {
            accumulator[keys[0]] = accumulator[keys[0]] || {};
            accumulator[keys[0]][keys[1]] = value;
        } else {
            accumulator[keys[0]] = value;
        }

        return accumulator;
    }, {});

    return polarisDmpFactory(map);
}
