var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var _ = require("lodash");


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

        if (req.params.sessionId){
            whereStr += " AND s.sessionId = ? "
            qryOption.replacements.push(req.params.sessionId);
        }
         
    }else{
        qryOption = { raw: true, type: models.sequelize.QueryTypes.SELECT}; 
    }

    let qryStr = 'SELECT \
    c.*, \
    s.sessionId, \
    s.sessionCreated, \
    s.sessionItemPath, \
    s.sessionItemType,\
    s.sessionThumbnailPath,\
    s.width,\
    s.height,\
    co.commentId, \
    co.commentText, \
    co.commentCreated, \
    co.xRatio, \
    co.yRatio, \
    co.userId as commentUserId \
    FROM tblcollections c\
    LEFT JOIN tblsessions s on s.collectionId = c.collectionId\
    LEFT JOIN tblcomments co on co.sessionId = s.sessionId ' + whereStr +
    ' ORDER BY c.collectionId, s.sessionId, co.commentId;';

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

            var collection = {
              "collectionId" : element.collectionId,
              "collectionTitle" : element.collectionTitle, 
              "collectionCreated" : element.collectionCreated,
              "userId" : element.userId,
              "sessions": []
             }

            var session = {
              "sessionId" : element.sessionId,
              "sessionItemPath" : element.sessionItemPath,
              "sessionItemType" : element.sessionItemType,
              "sessionThumbnailPath" : element.sessionThumbnailPath,
              "height" : element.height, 
              "width" : element.width,
              "comments" : [], 
              "votes"  : []
             };

          var collectionIndex = -1, 
                sessionIndex = -1;

          for (var i = 0; i<result.length; i++){
              if (result[i].collectionId == element.collectionId){
                  collectionIndex = i;
              }
          }

          if (collectionIndex == -1){

            addToArray(comment, "commentId", session.comments);
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

                addToArray(comment, "commentId", session.comments);
                addToArray(session, "sessionId", result[collectionIndex].sessions);

                sessionIndex = 0;

            }else{

                addToArray(comment, "commentId", result[collectionIndex].sessions[sessionIndex].comments);
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
        userId : req.auth.userId
      }).save()
      .then(anotherTask => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 

        req.io.emit('newCollection', "new collection created: " + req.body.collectionTitle);

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

module.exports =   { listQry, create, deleteItem };