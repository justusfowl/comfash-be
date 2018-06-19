var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var config = require("../../config/config");
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;


// HIER NOCH AUSLAGERNIN CONFIG 

var solr = require('solr-client');
var solrClient = solr.createClient(config.solr.server, config.solr.port, config.solr.core, '/solr');



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



function searchOutfits(req, res){

    let searchTerm = req.query.searchTerm;
    let filters = JSON.parse(req.query.filters);
    let top = req.query.top || 10;
    let skip = req.query.skip || 0;

    let sortedFilters = _.sortBy(filters, 'target');

    // var groupedFilters = _.chain(sortedFilters).groupBy("target").value();

    let qryString = '{!parent which="content_type:parentDocument"}';
    

    if (searchTerm && searchTerm.length > 0){
        qryString += '(labels:*' + searchTerm.toLowerCase() + '*)'
    }

    // DixMax query
    var query = solrClient.createQuery().q(qryString).start(skip).rows(top);
    
    for (var i=0; i<sortedFilters.length; i++){
        let keyWord = sortedFilters[i].category;
        let target = sortedFilters[i].target;
        let color = sortedFilters[i].color;

        let wildcard = "";
        let attr_color = "";

        if (target != "gender"){
            wildcard = "*"
        }

        if (color){
            attr_color = ' and +attr_color:' + color.toLowerCase()
        }

        let fq = '{!parent which="content_type:parentDocument"}(+labels:' + wildcard + keyWord.toLowerCase() + wildcard + ' and +attr_type:' + target.toLowerCase() + attr_color + ')';
        query.parameters.push("fq=" + encodeURIComponent(fq))
    }

    let searchHandler = function(err,obj){

        if(err){
            console.log(err);
            res.send(500, err);
        }else{
            res.json(obj.response)
            console.log(obj);
        }
    }

    solrClient.search(query,searchHandler);

}

function outfitMoreDetails(req, res){

    var url = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + "@" + config.mongodb.host + ":27017/";
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


}


module.exports =   { searchUser, searchOutfits, outfitMoreDetails };