const _ytregex = /^[a-zA-Z0-9_-]{11}$/;
module.exports = {
    YTIDRegex: _ytregex,
    checkValidYTID: function(id) {
        return _ytregex.test(id);
    } 
}