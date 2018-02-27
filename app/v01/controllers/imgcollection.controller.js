var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var _ = require("lodash");


function list (req,res) {

    if (req.params.collectionId){
        models.tblcollections.findAll({
            where: {
                collectionId: req.params.collectionId
              }
        }).then(function(collection) {
            if (collection) {				
                res.json(collection);
            } else {
                res.send(401, "User not found");
            }
            }, function(error) {
                
            res.send("User not found");
        });
    }else{

        models.tblcollections.findAll({}).then(function(collection) {
            if (collection) {				
                res.json(collection);
            } else {
                res.send(401, "User not found");
            }
            }, function(error) {
                
            res.send("User not found");
        });

    }
}


function addToArray (obj, key, array){

    if (obj[key]!=null){
        array.push(obj)
    }
}


function listQry (req,res) {

    var whereStr = ''; 
    var qryOption; 

    if (req.params.collectionId){
        whereStr = ' WHERE c.collectionId = ?'; 
        qryOption = { raw: true, replacements: [req.params.collectionId], type: models.sequelize.QueryTypes.SELECT}; 
    }else{
        qryOption = { raw: true, type: models.sequelize.QueryTypes.SELECT}; 
    }

    let qryStr = 'SELECT \
    c.*, \
    s.sessionId, \
    s.sessionCreated, \
    i.*, \
    co.commentId, \
    co.commentText, \
    co.commentCreated, \
    co.xRatio, \
    co.yRatio, \
    co.userId as commentUserId \
    FROM tblcollections c\
    LEFT JOIN tblsessions s on s.collectionId = c.collectionId\
    LEFT JOIN tblimages i on s.sessionId = i.sessionId\
    LEFT JOIN tblcomments co on i.imageId = co.commentId ' + whereStr +
    ' ORDER BY c.collectionId, s.sessionId, i.imageId, co.commentId;';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(collections => {

        var result = [];

        var nestCollection = function(element) {
            
            var comment  = {
                "commentId" : element.commentId, 
                "commentText" : element.commentText,
                "commentUserId" : element.commentUserId,
                "commentCreated" : element.commentCreated, 
                "xRatio": element.xRatio,
                "yRatio" : element.yRatio
               };

            var image  = {
              "imageId" : element.imageId, 
              "imagePath" : element.imagePath, 
              "height": element.height,
              "width" : element.width, 
              "comments" : []
             };

            var collection = {
              "collectionId" : element.collectionId,
              "collectionTitle" : element.collectionTitle, 
              "collectionCreated" : element.collectionCreated,
              "userId" : element.userId,
              "sessions": []
             }

            var session = {
              "sessionId" : element.sessionId,
              "images" : [], 
              "votes"  : []
             }
          var  collectionIndex = -1, 
                sessionIndex = -1,
                imageIndex = -1; 

          for (var i = 0; i<result.length; i++){
              if (result[i].collectionId == element.collectionId){
                  collectionIndex = i;
              }
          }

          if (collectionIndex == -1){

            addToArray(comment, "commentId", image.comments);
            addToArray(image, "imageId", session.images);
            addToArray(session, "sessionId", collection.sessions);

            result.push(collection);

            collectionIndex = 0;

          }else{

            for (var i = 0; i<result[collectionIndex].sessions.length; i++){
                if (result[collectionIndex].sessions[i].sessionId == element.sessionId){
                    sessionIndex = i;
                }
            }

            if (sessionIndex == -1){

                addToArray(comment, "commentId", image.comments);
                addToArray(image, "imageId", session.images);
                addToArray(session, "sessionId", result[collectionIndex].sessions);

                sessionIndex = 0;

            }else{

                for (var i = 0; i<result[collectionIndex].sessions[sessionIndex].images.length; i++){
                    if (result[collectionIndex].sessions[sessionIndex].images[i].imageId == element.imageId){
                        imageIndex = i;
                    }
                }

                if (imageIndex == -1){

                    addToArray(comment, "commentId", image.comments);
                    addToArray(image, "imageId", result[collectionIndex].sessions[sessionIndex].images);
                    

                    imageIndex = 0;
    
                }else{
                    addToArray(comment, "commentId", result[collectionIndex].sessions[sessionIndex].images[imageIndex].comments);
                }
            }
          }

        };
          
        _(collections).forEach(nestCollection); 

        res.json(result);
        console.log(result)
    })
}



function create(req, res){

    const collection = models.tblcollections.build({
        collectionTitle : req.body.collectionTitle, 
        userId : "uli@blubb" // HIER MUSS NOCH die userID aus dem token gezogen werden 
      }).save()
      .then(anotherTask => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 
        res.json(collection);
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
      })

}

function deleteItem(req, res){ 

    models.tblcollections.destroy({
        where: {
            collectionId: req.params.collectionId
          }
    }).then(function(collection) {
        if (collection) {				
            res.json(collection);
        } else {
            res.send(401, "User not found");
        }
        }, function(error) {
            
        res.send("User not found");
    });

}

module.exports =   { list, listQry, create, deleteItem };