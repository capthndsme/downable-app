const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const { checkValidYTID } = require("../shared/YTIDMatch");
 function GetAudio(req, res) {
    if (req.params.id) {
        if (checkValidYTID(req.params.id)) {

            if (fs.existsSync(`${config.cacheFolder}/${req.params.id}_cache.mp3`)) {
                res.download(`${config.cacheFolder}/${req.params.id}_cache.mp3`)
            } else {
                res.status(404).send('This file does not exist (yet) - Come back later');
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
    
}
 

module.exports = {
    GetAudio: GetAudio,
 
}