var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
    
const multer = require('multer');

var config  = require('../../config/config');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, config.baseDir + '/public/v')
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + '-' + Date.now() + ".mp4")
	}
  })

var uploadVideo = multer({ storage: storage })

function list (req,res) {

    models.tblsessions.findAll({
        where: {
            collectionId: req.params.collectionId
          }
    }).then(function(sessions) {
        if (sessions) {			
            res.json(sessions);
        } else {
            res.send(401, "Sessions not found");
        }
        }, function(error) {
            
        res.send("Sessions not found");
    });

}

function create(req, res){

    var filename = req.file.filename;

    const session = models.tblsessions.build({
        collectionId : req.params.collectionId, 
        sessionItemPath : "/v/" + req.file.filename, 
        sessionItemType : "video/mp4", 
        sessionThumbnailPath : "not implemented", 
        width: 100, 
        height: 100
      }).save()
      .then(anotherTask => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 
        res.json(anotherTask);
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
      })
}


module.exports =   { list, create, uploadVideo };