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
var MongoClient = require('mongodb').MongoClient;
var sharp = require("sharp");
var base64ToImage = require('base64-to-image');
var sessionConn = require("../connectors/session.connector")
var sessionRelConn = require('../connectors/sessionrelation.connector')

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
    }).catch(error => {
        config.logger.error(error);
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
                config.logger.error(error);
            });
    };

    insertSession();

}

var storageImg = multer.diskStorage({
	destination: function (req, file, cb) {
        //input images are stored in the "o" folder for original files
	  cb(null, config.baseDir + '/public/o')
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

function getImageColors(input){
    let resultFile = input.outputFile;

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

            input["color"] = {
                hexColorPrime : hexColorPrime,
                hexColorFont : hexColorFont
            };

            resolve(input);
    
        });
    
      });
    
      return promise;

}


function getImageMetaData(input){

    let resultFile = input.outputFile;

    var getMetaData = new Promise(
        function (resolve, reject) {

            var dimensions = sizeOf(resultFile);
             console.log(dimensions.width, dimensions.height);

             var resolution = {
                width : dimensions.width, 
                height: dimensions.height
            };
            input["resolution"] = resolution;
            resolve(input); 

        }
    );

    return getMetaData;


}


function getThumbnailImage(origFilePath, origFilename ){

    let resultFile = path.join(config.baseDir , '/public/t', origFilename); 
    let outputFile = resultFile + '.jpg';

    return new Promise(
        function (resolve, reject) {

            sharp(origFilePath)
                .resize(500, 500)
                .max()
                .withoutEnlargement()
                .toFormat('jpeg')
                .toFile(outputFile, function(err) {
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        let output = {
                            origFilePath: origFilePath,
                            origFilename :origFilename,
                            thumbnail : outputFile
                        };
                        resolve(output); 
                    }
                }); 

        }
    );

}

function resizeImage(input){

    let origFilePath = input.origFilePath;
    let origFilename = input.origFilename;
    
    let resultFile = path.join(config.baseDir , '/public/i', origFilename); 
    let outputFile = resultFile + '.jpg';

    return new Promise(
        function (resolve, reject) {

            sharp(origFilePath)
                .resize(1200, 1200)
                .max()
                .withoutEnlargement()
                .toFormat('jpeg')
                .toFile(outputFile, function(err) {
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        input["outputFile"] = outputFile;
                        resolve(input); 
                    }
                }); 

        }
    );

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

    let resultFilePath = path.join(config.baseDir , '/public/o', resultFilename); 

    let pureFileName = resultFilename.substr(0,resultFilename.indexOf("."));

    let colorObj;
    let hexColorPrime, hexColorFont;
    
    getThumbnailImage(resultFilePath, pureFileName)
    .then(resizeImage)
    .then(getImageColors)
    .then(getImageMetaData)
    .then(function (output) {
                const session = models.tblsessions.build({
                    collectionId : req.params.collectionId, 
                    sessionItemPath : "/i/" + pureFileName + ".jpg", 
                    sessionItemType : fileType, 
                    sessionThumbnailPath : "/t/" + pureFileName + ".jpg", 
                    width: output.resolution.width, 
                    height: output.resolution.height, 
                    primeColor : output.color.hexColorPrime,
                    primeFont :  output.color.hexColorFont, 
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
                    config.logger.error(error);
                  })

            })
            .catch(function (error) {
                console.log(error); 
                res.send(500, error);
                config.logger.error(error);
            });
    
}


function deleteSession(req, res){

    console.warn("HIER NOCH CHECKEN, OB BERECHTIGUNGEN VORLIEGEN")

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
                    config.logger.error(error);
                    res.send("comment not found");
            });

        } else {
            res.send(401, "Sessions not found");
        }
        }, function(error) {
        config.logger.error(error);
        res.send("Sessions not found");
    });

}

function addSessionRelation(req, res){

    let targetCollectionId = req.params.collectionId;
    let sourceSessionId = req.params.sessionId;
    let userId = req.auth.userId; 

    const relation = models.tblsessionrelations.upsert({
        targetCollectionId: targetCollectionId,
        sourceSessionId: sourceSessionId,
        userId: userId
    }).then(relation => {

        console.log("relation saved");

        let responseObj = {
            "isMySession" : false, 
            "isSaved" : true, 
            "targetCollectionId" : targetCollectionId
        };

        res.json(responseObj);
        
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error);
        config.logger.error(error);
        res.send(500, error);
      })

}

function getSessionRelationInfo(req, res){

    try{


        let userId = req.auth.userId; 
        let sessionId = req.params.sessionId; 


        (async () => {

            let responseObj = {};

            let sessionInfo = await sessionConn.getSessionInfo(sessionId);

            if (sessionInfo[0].userId == userId){
                responseObj["isMySession"] = true;
            }else{
                responseObj["isMySession"] = false;
            }

            let sessionRelationInfo = await sessionRelConn.getSessionRelationInfo(userId, sessionId);

            if (sessionRelationInfo.length > 0){
                responseObj["isSaved"] = true;
                responseObj["targetCollectionId"] = sessionRelationInfo[0].targetCollectionId;
            }else{
                responseObj["isSaved"] = false;
                responseObj["targetCollectionId"] = null;
            }

            
            res.json(responseObj);

        })();

        return true;

    }catch(error){
        res.send(500, "Server error retrieving sessionrelation information");
        config.logger.error(error);
    }

}

function removeSessionRelation(req, res){

    var userId = req.auth.userId;

    models.tblsessionrelations.destroy({
        where: {
            userId : userId,
            sourceSessionId: req.params.sessionId
          }
    }).then(function(session) {
            res.json({"message" : "ok"});
        }, function(error) {
            config.logger.error(error);
            res.send("something went wrong deleting sessionrelation");
    });

}


function uploadCapturedShopSession (req, res){

    try{

        let userId = req.auth.userId;   
        let sessionData = req.body.sessionData;
        let captureSessionId = req.body.captureSessionId; 

        // place pictures in folder a for avatars
        let targetPath = config.publicDir  + '/s/';

        var optionalObj = {'fileName': captureSessionId, 'type':'jpeg'}; 
        
        var imageInfo = base64ToImage(sessionData,targetPath,optionalObj); 

    let shopSession = {
        "captureSessionId" : req.body.captureSessionId,
        "userId" : userId,
        "path" : '/s/' + imageInfo.fileName,
        "shopId" : req.body.shopId,
        "dateCaptured" : req.body.dateCaptured
    }

    var url = "mongodb://" + 
        config.mongodb.username + ":" + 
        config.mongodb.password + "@" + 
        config.mongodb.host + ":" + config.mongodb.port +"/" + 
        config.mongodb.database + "/?authSource=" + config.mongodb.database + "&w=1" ;
        
    MongoClient.connect(url, function(err, db) {

        if (err) throw err;


        db.collection("shopSession").insert(shopSession, function(err, result) {
            
        if (err) throw err;
        console.log(result);

        res.json({"message" : "ok"});

        db.close();
        });
    });
    
    }catch(err){
        config.logger.error(err);
        console.log(err);
        res.send("something went wrong uploading the shop session");
    }


}


module.exports =   { list, create, uploadVideo, uploadImage, uploadImageMw, 
    deleteSession, removeSessionRelation, addSessionRelation, getSessionRelationInfo, uploadCapturedShopSession};