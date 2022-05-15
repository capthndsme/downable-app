// Initialization
const yt = require("youtube-search-without-api-key");
const fs = require("fs");
const express = require("express");
const config = JSON.parse(fs.readFileSync("config.json"));
console.log("[SearchService] Conf loaded: ", config);

const asyncHandler = require("express-async-handler");
var cors = require("cors");

// App
const app = express();

// Routes
const FileFetcher = require("./routes/FileFetcher.js");
const Download = require("./routes/Download.js");
const GetThumbnailProxy = require("./routes/GetThumbnailProxy.js");

// Port Config
const port = config.servicePort;

// Middleware
app.use(cors());
app.use(express.static("frontend"));

//Routes
app.get("/", (req, res) => {
  res.send("YouTube Search/Download Microservice.");
});
app.get("/download/:id", asyncHandler(Download.downloadYouTube));
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

app.get("/fetch/audio/:id", FileFetcher.GetAudio);

app.get("/test", Download.test);

app.get("/getAlbumArt/:id", asyncHandler(GetThumbnailProxy.GetThumbnailProxy));
app.listen(port, () => {
  console.log(`Downable-app started at port ${port}`);
});

// YT REGEX
// var myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
