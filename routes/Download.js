const ytdl = require("ytdl-core");
const fs = require("fs");
const lyricsFinder = require("lyrics-finder");
const config = JSON.parse(fs.readFileSync("config.json"));
const { checkValidYTID } = require("../shared/YTIDMatch");
module.exports = {
  downloadYouTube: async function (req, res, next) {
    let id = req.params.id;
    if (req.params.id) {
      if (checkValidYTID(req.params.id)) {
        if (fs.existsSync(`${config.cacheFolder}/${id}_cache.mp3`)) {
          let loadInfo = JSON.parse(
            fs.readFileSync(`${config.cacheFolder}/${id}.json`)
          );
          let loadLyrics = null;
          if (fs.existsSync(`${config.cacheFolder}/${id}_lyrics.json`)) {
            loadLyrics = JSON.parse(
              fs.readFileSync(`${config.cacheFolder}/${id}_lyrics.json`)
            );
          }
          res.send({
            success: true,
            audio: `/fetch/audio/${id}`,
            metadata: loadInfo,
            lyrics: loadLyrics?loadLyrics.lyrics:null,
          });
        } else {
          let info = await ytdl.getBasicInfo(
            `http://www.youtube.com/watch?v=${id}`
          );

          fs.writeFileSync(
            `${config.cacheFolder}/${id}.json`,
            JSON.stringify(info.videoDetails)
          );
          ytdl(`http://www.youtube.com/watch?v=${id}`, {
            quality: 140,
          })
            .pipe(
              fs
                .createWriteStream(`${config.cacheFolder}/${id}_cache.mp3`)
                .on("finish", async () => {
                 let lyrics = null;
                 let splice = info.videoDetails.title.replace(/ *\([^)]*\) */g, "").split("-");
                 
                 if (splice.length === 1) {
                    lyrics = await lyricsFinder(info.videoDetails.author, splice[0]);
                 } else {
                    lyrics = await lyricsFinder(splice[1], splice[0]);
                 }
                 
                 fs.writeFileSync(
                    `${config.cacheFolder}/${id})_lyrics.json`,
                    JSON.stringify({ lyrics: lyrics })
                  );

                  res.send({
                    success: true,
                    audio: `/fetch/audio/${id}`,
                    metadata: info.videoDetails,
                    lyrics: lyrics,
                  });
                  
                })
            )
            .on("error", () => {
              res.send({
                success: false,
              });
            });
        }
      } else {
        res.send({
          success: false,
          message: "Invalid ID parameter.",
        });
      }
    } else {
      res.send({
        success: false,
        message: "Missing [id] parameter.",
      });
    }
  },

  test: function (req, res, next) {
    res.send(config);
  },
};
