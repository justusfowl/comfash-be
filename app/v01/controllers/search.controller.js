var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var config = require("../../config/config");
var _ = require('lodash');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://" + 
config.mongodb.username + ":" + 
config.mongodb.password + "@" + 
config.mongodb.host + ":" + config.mongodb.port +"/" + 
config.mongodb.database + "?authSource=" + config.mongodb.database + "&w=1" ;


const request = require('request');
const http = require("http")
// HIER NOCH AUSLAGERNIN CONFIG 

var solr = require('solr-client');

function searchUser (req,res) {

    let searchStr = req.query.userSearch; 

    if (searchStr.length < 3){
        return res.status(500).send({ message: 'Not enough characters provided, at least 3.' });
    }

    models.tblusers.findAll({
        where : {
            [Op.or]: [
              {
                userId: {
                  [Op.like]: '%' + searchStr + '%'
                }
              },
              {
                userName: {
                  [Op.like]: '%' + searchStr + '%'
                }
              }
            ]
          },
        attributes: ['userId', 'userName', 'userAvatarPath']
    }).then(function(users) {
        if (users) {				
            res.json(users);
        } else {
            res.send(401, "User not found");
        }
        }, function(error) {
            config.logger.error(error);
            res.send("User not found");
    });
}

function getSearchMetaData(req, res){
    try{
        MongoClient.connect(url, function(err, db) {

            if (err) throw err;
            
            let dbo = db.db("cfdata");

            // Get the documents collection
            const collection = dbo.collection('meta');
            // Find some documents

            // get meta data for version 1.0

            collection.find({"version" : 1}).toArray(function(err, docs) {

                if (docs.length > 0){
                    res.json(docs[0]);
                }else{
                    res.send(500, "Error, meta version could not be found")
                }

                db.close();
                
                
            });
    
            
          });
    }
    catch(err){
        console.log(err)
        res.send(500, "Error")
    }
}

function searchOutfits(req, res){

    try{

        let validFilterFieldKeys = [
            "attr_category", 
            "attr_color", 
            "sex", 
            "attr_fabric",
            "attr_texture"
        ]

        let validSearchLang = [
            "en", "de"
        ];
        
        let searchTerm = req.query.searchTerm;
        let searchLang = req.query.searchLang;



        let filters;

        try{
            filters = JSON.parse(req.query.filters);
        }catch(err){
            filters = [];
        }
        
        let top = req.query.top || 10;
        let skip = req.query.skip || 0;

        

        let qryString;

        if (validSearchLang.indexOf(searchLang) == -1){
            searchLang = "en";
        }

        if (searchTerm && searchTerm.length > 0){

            // hier noch searchLang berücksichtigen -> aktuell tags_de leer
            
            if (searchLang != "en"){
                qryString = "tags_" + searchLang + ":" 
            }else{
                qryString = "tags_en:";
            }
            
           qryString += '("'  + searchTerm.toLowerCase() + '"~10)^10 OR (' +  searchTerm.toLowerCase() + ")^2";

        }else{
            qryString = '*:*'
        }

       var reqBody = {
        "query" : qryString,
        "params": {
            "rows" : top, 
            "start" : skip,
          },
        "filter" : ["content_type:parentDocument"],
        "facet": {
            "attr_category" : {
                "type": "terms",
                "field": "attr_category",
                "limit" : 20000,
                "domain": { "blockChildren" : "content_type:parentDocument" },
                "facet": {
                    "colors" : {
                        "type": "terms",
                        "field": "attr_color"
                        }
                    }
                },
            "attr_color" : {
                "type": "terms",
                "field": "attr_color",
                "limit" : 20000,
                "domain": { "blockChildren" : "content_type:parentDocument" }
            },
            "sex" : {
                "type": "terms",
                "field": "sex",
                "domain": { "blockChildren" : "content_type:parentDocument" }
            }, 
            "texture" : {
                "type": "terms",
                "field": "attr_texture",
                "domain": { "blockChildren" : "content_type:parentDocument" },
                "facet": {
                    "colors" : {
                        "type": "terms",
                        "field": "attr_color"
                        }
                    }
            }, 
            "fabric" : {
                "type": "terms",
                "field": "attr_fabric",
                "domain": { "blockChildren" : "content_type:parentDocument" },
                "facet": {
                    "colors" : {
                        "type": "terms",
                        "field": "attr_color"
                        }
                    }
            }
      }
    }



       for (var i=0; i<filters.length; i++){

        let filterTargetItem = filters[i];
        let color; 
        let hasColor = false;


        let numberOfFilters = filterTargetItem.filters.length;

        let fq;

        if (numberOfFilters > 0 ){

            if (filterTargetItem.attr_color){
                color = filterTargetItem.attr_color.name;
                hasColor = true;
            }

            let counterFilterTargets = 1;

             fq = "{!parent which='content_type:parentDocument'}("
    
            for (var j=0;j<filterTargetItem.filters.length;j++){
    
                let fqInner = "("
    
                let filterItem = filterTargetItem.filters[j];

                if (hasColor){
                    filterItem["attr_color"] = color;
                }
    
                let counterFilterItems = 1;
    
                let validKeysOfFilterItem = [];
    
                Object.keys(filterItem).forEach(function(key,index) {
    
                    if (validFilterFieldKeys.indexOf(key) != -1){
                        validKeysOfFilterItem.push(key);
                    }
    
                });
    
                let numberOfKeys = validKeysOfFilterItem.length;
    
                for (var k=0;k<validKeysOfFilterItem.length;k++){
                    let key = validKeysOfFilterItem[k];
    
                    fqInner += "+" + key + ":" + filterItem[key]
    
                    if (counterFilterItems != numberOfKeys){
                        fqInner += " AND "
                    }
    
                    counterFilterItems++;
                }
    
                fqInner += ")"
    
                if (counterFilterTargets != numberOfFilters){
                    fqInner += " OR "
                }
    
                counterFilterTargets++;
    
                fq += fqInner;
    
            }
    
            fq += ")"
        }else if (filterTargetItem.attr_color){

            fq = "{!parent which='content_type:parentDocument'}((+attr_color:" + filterTargetItem.attr_color.name + ") AND (+attr_type:" + filterTargetItem.attr_type + " ))"

        }

        if (fq){
            reqBody.filter.push(fq);
        }
        
       }

        request.post({
        json: true,
        url:     'http://' + config.solr.server + ':' + config.solr.port + '/solr/' + config.solr.core + '/query',
        body: reqBody
        }, function(error, response, responseBody){

            if (error){
                config.logger.error("Error posting to search engine");
                res.send(500, "Error posting to search engine")
            }
            console.log(responseBody);
            res.json(responseBody)
        });

       
    }catch(err){
        config.logger.error("Error in the searchOutfits part");
        config.logger.error(err);
    }
}

function outfitMoreDetails(req, res){

    try{
        var url = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + "@" + config.mongodb.host + ":" + config.mongodb.port +"/";
        var outfitId = req.params.outfitId
    
        MongoClient.connect(url, function(err, db) {
    
            if (err) throw err;
    
            var dbo = db.db(config.mongodb.database);
            dbo.collection("inspiration").find({id: outfitId}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
    
              if (result.length == 1){
                res.json(result[0]);
              }else{
                  if (result.length == 0){
                      res.json([])
                  }else{
                    res.send(500, "multiple entries available, check database")
                  }
                
              }
    
              db.close();
            });
          });
    
    }catch(err){
        res.send(500, "Error connecting to mongodb")
    }
   

}


module.exports =   { searchUser, getSearchMetaData, searchOutfits, outfitMoreDetails };