var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;


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

    const session = models.tblsessions.build({
        collectionId : req.params.collectionId
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

/*
function create(req, res){

    var imgPaths  = ["http://cl18:9999/img/1.jpg", "http://cl18:9999/img/2.jpg", "http://cl18:9999/img/3.jpg"]

    const session = models.tblsessions.build({
        collectionId : req.params.collectionId
      }).save()
      .then(createdSession => {

        var values = [];

        imgPaths.forEach(function(element){
            values.push({
                imagePath: element,
                height: 200,
                width: 300,
                sessionId: createdSession.sessionId
            }); 
        });

        models.tblimages.bulkCreate(values).then(() => {
            // nope bar, you can't be admin!
            console.log("blubb")
          })

        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 
        res.json(session);
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
      })

}

*/


module.exports =   { list, create };