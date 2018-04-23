var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var fs = require('fs');
var hash = require ('string-hash');
const path = require('path')

const multer = require('multer');
var messageCtrl = require('../controllers/message.controller');
var tagCtrl = require('../controllers/tag.controller');

var config  = require('../../config/config');


var ffmpeg = require('fluent-ffmpeg');

var socketCtrl = require('../socket/socket.controller');

const getColors = require('get-image-colors')
var sizeOf = require('image-size');
var rgb2hex = require('rgb2hex');

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

    console.log(" HIER MUSS NOCH ÜBERPRÜFT WERDEN, DASS NUR DER OWNER ITEMS EINSTELLEN KANN ODER VORHER EINE GENEHMIGUNG ERTEILT WRERDEN MUSS")

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

        let userId = req.auth.userId; 

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
                  .then(resultingSession => {
                    // you can now access the currently saved task with the variable anotherTask... nice!
                    console.log("after save"); 

                    res.json(resultingSession);

                    let sessionId = resultingSession.sessionId; 
                    
                    (async () => {
                        await messageCtrl.notifySessionCreate(userId, sessionId)
                    })();
            
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

var storageImg = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, config.baseDir + '/public/i')
	},
	filename: function (req, file, cb) {
        var userId = req.auth.userId;
        var ext = path.extname(file.originalname); 

	    cb(null, hash(userId) + file.fieldname + '-' + Date.now() + ext)
	}
  })

var uploadImageMw = multer({ storage: storageImg })

function getImageColors(resultFile){

    var promise = new Promise(function(resolve, reject) {
        
        getColors(resultFile).then(colors => {
            // `colors` is an array of color objects 
            let me = colors; 
            console.log(me);
    
            let primColor = colors[0]._rgb; 
    
    
            let rgbStr = "rgb(" + primColor[0] + "," + primColor[1] + "," + primColor[2] + ")"
            let hexColor = rgb2hex(rgbStr).hex;
            console.log(hexColor);

            resolve(hexColor);
    
    
        });

        
      });
    
      return promise;

}


function getImageMetaData(resultFile){

    var getMetaData = new Promise(
        function (resolve, reject) {

            var dimensions = sizeOf(resultFile);
             console.log(dimensions.width, dimensions.height);

             var resolution = {
                width : dimensions.width, 
                height: dimensions.height
            };
            resolve(resolution); 

        }
    );

    return getMetaData;


}

/**
 * Upload base64 encoded string to create a session from a picture
 */
function uploadImage(req, res){

    console.log(" HIER MUSS NOCH ÜBERPRÜFT WERDEN, DASS NUR DER OWNER ITEMS EINSTELLEN KANN ODER VORHER EINE GENEHMIGUNG ERTEILT WRERDEN MUSS")

    var imageSrc = req.body.src;
    var imagePurchaseTags;

    try{
        imagePurchaseTags = JSON.parse(req.body.newTags);
    }catch(err){
        imagePurchaseTags = [];
    }
     
    var userId = req.auth.userId;
    var resultFilename = req.file.filename;
    var fileType = req.file.mimetype;

    let resultFile = path.join(config.baseDir , '/public/i', resultFilename); 

    let colorCode;
    
    getImageColors(resultFile)
    .then(function(color){
        colorCode = color;
        return resultFile
    })
    .then(getImageMetaData)
    .then(function (resolution) {
                const session = models.tblsessions.build({
                    collectionId : req.params.collectionId, 
                    sessionItemPath : "/i/" + req.file.filename, 
                    sessionItemType : fileType, 
                    sessionThumbnailPath : "/i/" + req.file.filename, 
                    width: resolution.width, 
                    height: resolution.height, 
                    primeColor : colorCode
                  }).save()
                  .then(resultingSession => {
                    
                    console.log("after save"); 

                    res.json(resultingSession);

                    let sessionId = resultingSession.sessionId; 
                    
                    (async () => {
                        await messageCtrl.notifySessionCreate(userId, sessionId);
                        
                        if (imagePurchaseTags.length > 0){
                            await tagCtrl.createTags(sessionId, imagePurchaseTags);
                        }
                        
                    })();

                    return true;
            
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
    
}



function deleteSession(req, res){

    models.tblsessions.findAll({
        where: {
            sessionId: req.params.sessionId
          }
    }).then(function(session) {
        if (session) {
            
            let itemPath = (config.publicDir + session[0].sessionItemPath).replace(new RegExp(/\\/g),"/");
            let sessionThumbnailPath = (config.publicDir + session[0].sessionThumbnailPath).replace(new RegExp(/\\/g),"/");

            models.tblsessions.destroy({
                where: {
                    sessionId: req.params.sessionId
                  }
            }).then(function(session) {

                try{
                    fs.unlinkSync(itemPath);

                    if (itemPath != sessionThumbnailPath){
                        fs.unlinkSync(sessionThumbnailPath);
                    }

                    res.json({"message" : "ok"});

                }catch(err){
                    res.send(500, "files could not be found")
                }

                }, function(error) {
                    
                res.send("comment not found");
            });

        } else {
            res.send(401, "Sessions not found");
        }
        }, function(error) {
            
        res.send("Sessions not found");
    });

}

module.exports =   { list, create, uploadVideo, uploadImage, uploadImageMw, deleteSession };