var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
    
const multer = require('multer');

var config  = require('../../config/config');

var ffmpeg = require('fluent-ffmpeg');

var socketCtrl = require('../socket/socket.controller');

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

    var resultFilename = req.file.filename;

    var resultFile = resultFilename.substring(0,resultFilename.indexOf("."));

    var proc = new ffmpeg(req.file.path)
        .takeScreenshots({
            count: 1,
            timemarks: [ '1' ], 
            filename: '%b-thumbnail'
            }, config.baseDir + '/public/t', function(err) {
            console.log('screenshots were saved')
        });
    
    var getMetaData = new Promise(
        function (resolve, reject) {
            ffmpeg.ffprobe(req.file.path, function(err, metadata) {
                console.dir(metadata);
                let width = metadata.streams[0].coded_width; 
                let height = metadata.streams[0].coded_height;

                // inverse height/width for iphone as of now 

                var resolution = {
                    width : height, 
                    height: width
                }
                resolve(resolution); 
            });
        }
    );
    
    var insertSession = function () {
        getMetaData
            .then(function (resolution) {
                const session = models.tblsessions.build({
                    collectionId : req.params.collectionId, 
                    sessionItemPath : "/v/" + req.file.filename, 
                    sessionItemType : "video/mp4", 
                    sessionThumbnailPath : "/t/" + resultFile + "-thumbnail.png", 
                    width: resolution.width, 
                    height: resolution.height
                  }).save()
                  .then(anotherTask => {
                    // you can now access the currently saved task with the variable anotherTask... nice!
                    console.log("after save"); 
                    let msgOption = {
                        userId : req.auth.userId
                    }
                    res.json(anotherTask);
                    
                    socketCtrl.emitMsgToGroup(req, 'a session has been stored');
                  })
                  .catch(error => {
                    // Ooops, do some error-handling
                    console.log(error); 
                    res.send(500, error);
                  })

            })
            .catch(function (error) {
                console.log(error); 
                res.send(500, error);
            });
    };

    insertSession();

}


module.exports =   { list, create, uploadVideo };