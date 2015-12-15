function objectToArray(obj, filterFalse) {
    return !filterFalse ? Object.keys(obj) : Object.keys(obj).filter(function(prop) {
        //Filtering string false due to working with cookies
        return obj[prop] !== 'false' && obj[prop] !== false;
    });
}

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

function getSimpleSegment(keys) {
    var simpleSegments = ['secure', 'stabilise', 'stimulate', 'support'];
    for (var i = 0; i < simpleSegments.length; i++) {
        if (keys.indexOf(simpleSegments[i]) > -1) {
            return simpleSegments[i];
        }
    }

    return 'unknown';
}

function isProspect(map) {
    return !isCustomer(map);
}

function isCustomer(map) {
    return map['prospect'] === 'false';
}

function getPackages(map) {
    return objectToArray(map['package'] || {}, true);
}

function hasPackage(map, pkg) {
    return hasAllPackages(map, [pkg]);
}

function hasAllPackages(map, requestedPackages) {
    var actualPackages = getPackages(map);
    for (var i = 0; i < requestedPackages.length; i++) {
        if (actualPackages.indexOf(requestedPackages[i]) === -1) {
            return false;
        }
    }

    return true;
}

function hasAnyPackages(map, requestedPackages) {
    var actualPackages = getPackages(map);
    for (var i = 0; i < requestedPackages.length; i++) {
        if (actualPackages.indexOf(requestedPackages[i]) !== -1) {
            return true;
        }
    }

    return false;
}

function hasBroadband(map) {
    return map['broadband'] === 'true';
}

function hasTV(map) {
    return hasAnyPackages(map, ['original', 'family', 'variety']);
}

function getEthanStatus(map) {
    var ethan = map['ethan'];
    switch (ethan) {
        case 'true':
            return 'ethan';
        case 'false':
            return 'classic';
        default:
            return 'unknown';
    }
}

function polarisDmpFactory(map) {
    var keys = Object.keys(map);
    return {
        getSimpleSegment: partial(getSimpleSegment, keys),
        getPackages: partial(getPackages, map),
        isProspect: partial(isProspect, map),
        isCustomer: partial(isCustomer, map),
        hasPackage: partial(hasPackage, map),
        hasAnyPackages: partial(hasAllPackages, map),
        hasAllPackages: partial(hasAllPackages, map),
        hasBroadband: partial(hasBroadband, map),
        hasTV: partial(hasTV, map),
        getEthanStatus: partial(getEthanStatus, map)
    };
}


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
    console.log(cookieValueDecoded)
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

var  selectOfferTex = function(){
  var polarisDmp = parseDocumentCookie(document.cookie);
  if (!polarisDmp.hasPackage('sports') && !polarisDmp.hasPackage('movies')) {
      return 'movies';
  }else if (!polarisDmp.hasPackage('movies') && polarisDmp.hasPackage('sports')) {
      return 'movies';
  }else if (polarisDmp.hasPackage('movies') && !polarisDmp.hasPackage('sports')) {
      return 'sports';
  }
  return 'generic';
}

var offerType = selectOfferTex();
var element = document.getElementById(offerType);
element.style.display='block';
