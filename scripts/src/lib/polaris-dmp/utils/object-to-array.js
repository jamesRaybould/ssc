function objectToArray(obj, filterFalse) {
    return !filterFalse ? Object.keys(obj) : Object.keys(obj).filter(function(prop) {
        //Filtering string false due to working with cookies
        return obj[prop] !== 'false' && obj[prop] !== false;
    });
}
