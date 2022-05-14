const fs = require("fs");
 function GetAudio(req, res, next) {
    if (fs.existsSync(`${this._CONF}/${req.params.id}.mp3`)) {
        res.download(`${this._CONF}/${req.params.id}.mp3`)
    } else {
        res.status(404).send('This file does not exist (yet) - Come back later');
    }
}
 function GetAlbumArt(req, res, next) {
    if (fs.existsSync(`${this._CONF}/${req.params.id}.jpg`)) {
        res.download(`${this._CONF}/${req.params.id}.jpg`)
    } else {
        res.status(404).send('This file does not exist (yet) - Come back later');
    }
}

module.exports = {
    GetAudio: GetAudio,
    GetAlbumArt: GetAlbumArt    
}