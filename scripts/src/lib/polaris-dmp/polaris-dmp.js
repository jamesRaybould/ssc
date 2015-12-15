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
