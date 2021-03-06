var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const config = require('../../config/config');
const multer = require('multer');
const path = require('path');

var amqp = require('amqplib/callback_api');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://" + 
config.mongodb.username + ":" + 
config.mongodb.password + "@" + 
config.mongodb.host + ":" + config.mongodb.port +"/" + 
config.mongodb.database + "?authSource=" + config.mongodb.database + "&w=1" ;


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
                        config.handleUniversalError(error, res);
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

function getCrawledLabelsInfo(req, res){

    try{

        MongoClient.connect(url, function(err, db) {

            if (err) throw err;
            let dbo = db.db("cfdata");
            // Get the documents collection
            const collection = dbo.collection('inspiration');

            // Find some documents
            collection.aggregate(
                [
                    {"$match": { "owner": { "$eq": "google-crawl" } } },
                    {"$group" : {"_id" : {"keywords": "$keywords"}, "total" : {"$sum" : 1}}},
                    {"$project" : {"_id" : 1, "label" : "$_id.keywords","total": 1}},
                    {"$sort" : {
                        "label" : -1
                    }}
                ]
            ).toArray(function(err, docs) {

                if (err) throw err;

                res.json(docs);

                db.close();
                
            });

        });

    }catch(err){
        config.handleUniversalError(error, res, "Error in retrieving the crawled labels' info");
    }

}

function getGroupLabelsInfo(req, res){

    try{

        let flagIsValidated;

        if (req.query.isValidated){
            flagIsValidated = JSON.parse((req.query.isValidated).toLowerCase()); 
        }else{
            flagIsValidated = false;
        }
        
        let label = req.query.attr_category || false;
        let attrType = req.query.attr_type ||  "clothing";

        let sorting = {};
        let sortBy = req.query.sortby ||  "label";

        let sortDirection = parseInt(req.query.sort) || 1;

        sorting[sortBy] = sortDirection;

        let filterArray = [
            {"$match": { "isValidated": { "$eq": flagIsValidated } } },
            {"$unwind" :  "$_childDocuments_" },
            {"$group" : {"_id" : {"label": "$_childDocuments_.attr_category", 
             "attr_type": "$_childDocuments_.attr_type"}, "total" : {"$sum" : 1}, 
             "ids" : {"$addToSet" : "$id"}}},
             {"$project" : {"_id" : 1, "label" : "$_id.label", "attr_type" : "$_id.attr_type","total": 1}},
                {"$sort" : sorting}
        ];

        if (label){
            filterArray.push({ "$match": { "attr_type": { "$eq": attrType }, "label": { "$eq": label } } });
        }else{
            filterArray.push({ "$match": { "attr_type": { "$eq": attrType } } });
        }

        MongoClient.connect(url, function(err, db) {

            if (err) throw err;

            let dbo = db.db("cfdata");

            // Get the documents collection
            const collection = dbo.collection('inspiration');

            // Find some documents
            collection.aggregate(
                filterArray
            ).toArray(function(err, docs) {

                if (err) throw err;
                
                res.json(docs);

                db.close();
                
            });
    
          });
    }
    catch(err){
        config.handleUniversalError(err, res, "Error");
    }

}

function getSearchItem(req, res){

    try{

        let queryMode = req.query.mode || "pre";

        let filterArray = [];

        filterArray.push({"isValidated" : false});
        filterArray.push( {$or: [
            {lockTime : {$exists: false}},
            {lockTime:  {$lt: new Date((new Date())-1000*60*60*24)}}
            ]
        });

        if (queryMode == "pre"){
            filterArray.push({"owner" : "deepfashion"});
            let attr_category = req.query.attr_category || false;

            if (attr_category){
                filterArray.push({"_childDocuments_" : {$elemMatch : {"attr_category" : attr_category }}});
            }

        }else if (queryMode == "crawl"){
            filterArray.push({"owner" : "google-crawl"});
            let keywords = req.query.keywords || false;

            if (keywords){
                filterArray.push({"keywords" : keywords});
            }
        }

        MongoClient.connect(url, function(err, db) {

            if (err) throw err;
         
            let dbo = db.db("cfdata");

            // Get the documents collection
            const collection = dbo.collection('inspiration');
            // Find some documents
            collection.find(
                {$and : filterArray}
            ).limit(1).toArray(function(err, docs) {

                if (err) throw err;
         
                res.json(docs);

                if (docs.length > 0){
                   collection.update({"id" : docs[0].id}, {$set: { lockTime: new Date() } })
                }

                db.close();
                
            });
    
          });
    }
    catch(err){
        config.handleUniversalError(err, res, "Error");
    }

}

function issueCrawlRequest(req, res){

    try{

        let searchPhrase = req.body.searchPhrase;
        let userId = req.auth.userId;

        if (!searchPhrase){
            res.send(500, "Please issue valid search phrases only")
            return;
        }

        let searchObject = {
            "searchPhrase" : searchPhrase, 
            "userId" : userId
        }

        amqp.connect('amqp://' + config.mq.mqUser + ':' + config.mq.mqPassword + '@' + config.mq.mqServer + ':' + config.mq.mqPort, function (err, conn) {

            if (err){ 
                throw Error(err);
            }

            conn.createChannel(function (err, ch) {

                ch.assertQueue('gather', { durable: false });
                
                ch.sendToQueue('gather', new Buffer(JSON.stringify(searchObject)));

                res.json({"message" : "ok"});

            });

            setTimeout(function () { 
                conn.close(); 
            }, 1000); 

        });

    }catch(err){
        config.handleUniversalError(err, res, "Please issue valid search phrases only");
    }
    
}

function approveSearchItem(req, res){

    try{

        let searchItem = req.body.searchItem;
        let userId = req.auth.userId;

        searchItem["isValidated"] = true;
        searchItem["userIdHasValidated"] = userId;

        if (searchItem._id){
            delete searchItem._id
        }

        MongoClient.connect(url, function(err, db) {

            if (err) throw err;

            let dbo = db.db("cfdata");

            // Get the documents collection
            const collection = dbo.collection('inspiration');
            // Find some documents
            collection.replaceOne({"id" : searchItem.id}, searchItem ,function(err, result) {

                if (err) throw err;
                
                res.json(result);

                if (!result.ops[0].isSetTrainOnly){
                    issueValidatedMsg(searchItem);
                }
                
                db.close();
                
            });

        });

    }catch(err){
        config.handleUniversalError(err, res, "An error occured validating the image");

    }
}

function issueValidatedMsg(searchItem){
    
  amqp.connect('amqp://' + config.mq.mqUser + ':' + config.mq.mqPassword + '@' + config.mq.mqServer + ':' + config.mq.mqPort, function (err, conn) {

    if (err) throw err;

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

            let dbo = db.db("cfdata");

            dbo.collection("inspiration").remove({id: id}, function(err, result) {
              if (err) throw err;
    
              res.json({"message" : "ok"});
    
              db.close();
            });
          });

      }).catch(error => {
        config.handleUniversalError(error, res);
      });

}

module.exports = { hb, addCrawlSession, uploadImageMw, getSearchItem, approveSearchItem, rejectSearchItem, getGroupLabelsInfo, getCrawledLabelsInfo, issueCrawlRequest};