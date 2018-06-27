var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const config = require('../../config/config');
const multer = require('multer');
const path = require('path');

var amqp = require('amqplib/callback_api');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + "@" + config.mongodb.host + ":" +config.mongodb.port +"/";

var storageImg = multer.diskStorage({
	destination: function (req, file, cb) {
        //input images are stored in the "o" folder for original files
	  cb(null, config.baseDir + '/public/p')
	},
	filename: function (req, file, cb) {
        var ext = path.extname(file.originalname); 

        cb(null, file.originalname);
        
	}
  })

var uploadImageMw = multer({ storage: storageImg });

async function getCrawlSessionInfo (filename) {
    
    return new Promise(
        (resolve, reject) => {

            var qryOption = { raw: true, replacements: [filename], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT * FROM cfdata.tblsessions as s \
            where s.sessionItemPath = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(sessionInfo => {
                if (sessionInfo.length == 1){
                    resolve(sessionInfo[0]);
                }else if (sessionInfo.length == 0){
                    resolve(null);
                }else{
                    config.logger.error("Checking on a crawl-session item, there are multiple entries for the same file!");
                    resolve(sessionInfo[0]);
                }
            })
        }
    );
    
}

function addCrawlSession(req, res){

    try{
        // place images into the p = public folder 

        var resultFilename = "/p/"+ req.file.originalname;
    
        let width = req.body.imageWidth || 0; 
        let height = req.body.imageHeight || 0; 
    
        (async () => {
            // send notification to owner of the session

            let crawlItemInfo = await getCrawlSessionInfo(resultFilename);
            
            if (!crawlItemInfo){
                const session = models.tblsessions.build({
                    collectionId : req.body.collectionId, 
                    sessionItemPath : resultFilename, 
                    sessionItemType : "image/jpeg", 
                    sessionThumbnailPath : resultFilename, 
                    width: width, 
                    height: height
                    }).save()
                    .then(resultingSession => {
            
                    let sessionId = resultingSession.sessionId; 
                    res.json({"sessionId" : sessionId});
            
                    })
                    .catch(error => {
                    // Ooops, do some error-handling
                    console.log(error); 
                    res.send(500, error);
                    config.logger.error(error);
                    })
            }else{
                let sessionId = crawlItemInfo.sessionId;
                res.json({"sessionId" : sessionId});
            }

        })();
    

    }catch(error){
        config.logger.error(error);
    }

}

function hb(req, res){

    let secret = req.body.auth0_secret;
    if (secret == config.auth.auth0_secret){
        res.json({"message" : "ok"});
    
    }else{
        res.send(401, "Unauthorized");
    }

}

function getSearchMetaData(req, res){
    try{
        MongoClient.connect(url, function(err, client) {

            if (err) throw err;
            console.log("Database created!");

            const db = client.db("cfdata");

            // Get the documents collection
            const collection = db.collection('meta');
            // Find some documents

            // get meta data for version 1.0

            collection.find({"version" : 1}).toArray(function(err, docs) {

                if (docs.length > 0){
                    res.json(docs[0]);
                }else{
                    res.send(500, "Error, meta version could not be found")
                }
                
                
            });
    
            
          });
    }
    catch(err){
        console.log(err)
        res.send(500, "Error")
    }
}

function getSearchItem(req, res){

    try{
        MongoClient.connect(url, function(err, client) {

            if (err) throw err;
            console.log("Database created!");

            const db = client.db("cfdata");

            // Get the documents collection
            const collection = db.collection('inspiration');
            // Find some documents
            collection.find({"isValidated" : false}).limit(5).toArray(function(err, docs) {
                
                console.log("Found the following records");
                console.log(docs);

                res.json(docs);
                
            });
    
            
          });
    }
    catch(err){
        console.log(err)
        res.send(500, "Error")
    }

}

function approveSearchItem(req, res){

    let searchItem = req.body.searchItem;
    searchItem["isValidated"] = true;

    MongoClient.connect(url, function(err, client) {

        if (err) throw err;
        console.log("Database created!");

        const db = client.db("cfdata");

        // Get the documents collection
        const collection = db.collection('inspiration');
        // Find some documents
        collection.replaceOne({"id" : searchItem.id}, searchItem ,function(err, result) {
            
            console.log("Item approved and replaced");
            console.log(result);

            res.json(result);

            issueValidatedMsg(searchItem);
            
        });

      });
}

function issueValidatedMsg(searchItem){
    
  amqp.connect('amqp://' + config.mq.mqUser + ':' + config.mq.mqPassword + '@' + config.mq.mqServer + ':' + config.mq.mqPort, function (err, conn) {

    if (err){
        console.log(err); 
        return;
    }

  conn.createChannel(function (err, ch) {

    var validated = 'validated';
    ch.assertQueue(validated, { durable: false });
    
    ch.sendToQueue(validated, new Buffer(JSON.stringify(searchItem)));

  });

  setTimeout(function () { conn.close(); }, 1000); 
  });
}


function rejectSearchItem(req, res){

    let id = req.params.id; 

    var qryOption = { raw: true, replacements: [id], type: models.sequelize.QueryTypes.UPDATE}; 
    
    let qryStr = 'update cfdata.tblinspirations set isRejected = 1  \
    where urlHash = ?;';
    

    models.sequelize.query(
        qryStr,
        qryOption
    ).then((result, metadata) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        u = result;
        m = metadata;

        MongoClient.connect(url, function(err, db) {

            if (err) throw err;
    
            var dbo = db.db(config.mongodb.database);
            dbo.collection("inspiration").remove({id: id}, function(err, result) {
              if (err) throw err;
              console.log(result);
    
              res.json({"message" : "ok"});
    
              db.close();
            });
          });

        

      }).catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
        config.logger.error(error);
      });

}

module.exports = { hb, addCrawlSession, uploadImageMw, getSearchItem, getSearchMetaData, approveSearchItem, rejectSearchItem};