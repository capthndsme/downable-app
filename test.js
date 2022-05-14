const ytdl = require("ytdl-core");
const fs = require("fs");
ytdl(`http://www.youtube.com/watch?v=1-JCbVBRPQo`, {
  quality: 140,
})
.pipe(
    fs.createWriteStream('good.mp4')
)

