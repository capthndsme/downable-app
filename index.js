const yt = require("youtube-search-without-api-key");
const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
const config = JSON.parse(fs.readFileSync("config.json"));
const asyncHandler = require("express-async-handler");
var cors = require("cors");
const app = express();
const FileFetcher = require("./routes/FileFetcher.js")
FileFetcher._CONF = config;
const port = config.servicePort;
const downloaderBackend = "http://192.168.1.244:24415/";

app.use(cors());
app.get("/", (req, res) => {
  res.send("YouTube Search/Download Microservice.");
});
app.get(
  "/search/:query",
  asyncHandler(async (req, res, next) => {
    const queryResult = await yt.search(req.params.query);
    res.send(queryResult);
  })
);
app.get("/search", (req, res) => {
  res.send(
    `<b>/search/:query: Endpoint</b><br/>
         Searches :query: on YouTube.
         <br/>
         <b>Returns</b> array of results`
  );
});
app.get(
  "/download/:id",
  asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    if (fs.existsSync(`${config}/${id}_cache.mp3`)) {
      let loadInfo = JSON.parse(fs.readFileSync(`${config}/${id}.json`));
      res.send({
        id: id,
        title: loadInfo.title,
        downloadUrl: downloaderBackend + `getCache/${id}_cache.mp3`,
      });
    }
    let info = await ytdl.getInfo(id); 
    ytdl.chooseFormat(info.formats, {quality: 140});
    ytdl(`http://www.youtube.com/watch?v=${id}`).pipe(
      fs.createWriteStream(`${config}/${id}_cache.mp3`)
    );
  })
);

app.get("/fetch/audio/:id", FileFetcher.GetAudio)
app.get("/fetch/albumart/:id", FileFetcher.GetAlbumArt)

app.listen(port, () => {
  console.log(`YouTube search microservice started at port ${port}`);
});
