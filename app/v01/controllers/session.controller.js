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

// function to calculate color contrast for font-color

function luminanace(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
    return (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05)
         / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
}

function getHex(rgbArray){

    let rgbStr = "rgb(" + rgbArray[0] + "," + rgbArray[1] + "," + rgbArray[2] + ")"
    let hexColor = rgb2hex(rgbStr).hex;

    return hexColor;

}

function getImageColors(resultFile){

    var promise = new Promise(function(resolve, reject) {
        
        getColors(resultFile).then(colors => {
            // `colors` is an array of color objects 
            let me = colors; 
            console.log(me);
    
            let primColor = colors[0]._rgb; 
            
            let whiteColor = [255,255,255]; 
            let darkColor = [61, 61, 61] //[51, 67, 75];

            let whiteContrast = contrast(primColor, whiteColor);
            let darkContrast = contrast(primColor, darkColor);

            let fontColor;

            if (whiteContrast < darkContrast){
                fontColor = whiteColor;
            }else{
                fontColor = darkColor;
            }

            let hexColorPrime = getHex(primColor);
            let hexColorFont = getHex(fontColor);

            resolve({
                hexColorPrime : hexColorPrime,
                hexColorFont : hexColorFont
            });
    
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
    var imagePurchaseTags, filterOption;

    try{
        imagePurchaseTags = JSON.parse(req.body.newTags);
    }catch(err){
        imagePurchaseTags = [];
    }

    filterOption = req.body.filterOption;
     
    var userId = req.auth.userId;
    var resultFilename = req.file.filename;
    var fileType = req.file.mimetype;

    let resultFile = path.join(config.baseDir , '/public/i', resultFilename); 

    let colorObj;
    let hexColorPrime, hexColorFont;
    
    getImageColors(resultFile)
    .then(function(color){
        colorObj = color;
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
                    primeColor : colorObj.hexColorPrime,
                    primeFont :  colorObj.hexColorFont, 
                    filterOption : filterOption
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