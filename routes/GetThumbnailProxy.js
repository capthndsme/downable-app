const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const https = require("https");
const { checkValidYTID } = require("../shared/YTIDMatch");

module.exports = {
  GetThumbnailProxy: async function (req, res, next) {
    if (req.params.id) {
      if (checkValidYTID(req.params.id)) {
        let baseUrl = `https://i.ytimg.com/vi/${req.params.id}/maxresdefault.jpg`;
        let fileBaseUrl = `${config.cacheFolder}/${req.params.id}_art.jpg`;
        // Check if our file exists from the cache.
        if (fs.existsSync(fileBaseUrl)) {
          res.download(fileBaseUrl);
        } else {
          // Download and serve the file.

          const file = fs.createWriteStream(fileBaseUrl)
          const rereq = https.get(
            baseUrl,
            function (response) {
              response.pipe(file);

              // after download completed close filestream
              file.on("finish", () => {
                file.close();
                res.download(fileBaseUrl);
              });
            }
          );
          
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
};
