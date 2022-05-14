const lyrics = require('get-azlyrics');
module.exports = {
     FindLyricsFromTitle: async function(req,res) {
        lyrics.getLyrics(req.params.title)
        .then(x => {
            res.send({
                success: true,
                lyrics: x
            })
        })
        .catch(res.send({
            success: false
        }))
     }
}