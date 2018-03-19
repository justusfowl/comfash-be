var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var _ = require("lodash");
var socketCtrl = require('../socket/socket.controller');
var messageCtrl = require('../controllers/message.controller');

function addToArray (obj, key, array){

    let index = array.findIndex(x => x[key] === obj[key])

    if (obj[key]!=null && index == -1){
        array.push(obj)
    }
}


function listQry (req,res) {

    let userId, whereStr, qryOption; 

    userId = req.params.userId; 

    /*
    

    if (!userId){
        return res.status(500).send({ auth: false, message: 'No userid provided' });
    }
   
    var whereStr = ' WHERE c.userId = ? '; 
    
    */

    whereStr = ' WHERE c.userId = ? ';
    qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 

    if (req.params.collectionId){

        userId = req.auth.userId;
        
        whereStr = ' WHERE c.collectionId = ? ';
        qryOption = { raw: true, replacements: [req.params.collectionId], type: models.sequelize.QueryTypes.SELECT}; 

        if (req.params.sessionId){
            whereStr += " AND s.sessionId = ? "
            qryOption.replacements.push(req.params.sessionId);
        }
         
    }

    let qryStr = 'SELECT \
    c.*, \
    colUs.userName, \
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
    co.userId as commentUserId, \
    co.prcSessionItem, \
    us.userName as commentUserName, \
    v.voteType, \
    v.voteChanged, \
    v.userId as voteUserId \
    FROM tblcollections c\
    LEFT JOIN tblsessions s on c.collectionId = s.collectionId\
    LEFT JOIN tblcomments co on s.sessionId = co.sessionId \
    LEFT JOIN tblusers us on co.userId = us.userId\
    LEFT JOIN tblusers colUs on c.userId = colUs.userId\
    LEFT JOIN tblvotes v on s.sessionId = v.sessionId ' + whereStr +
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
                "yRatio" : element.yRatio, 
                "prcSessionItem" : element.prcSessionItem, 
                "commentUserName" : element.commentUserName
               };

            var vote = {
                "sessionId" : element.sessionId, 
                "voteType" : element.voteType,
                "voteChanged" : element.voteChanged,
                "userId" : element.voteUserId
               };

            var collection = {
                "collectionId" : element.collectionId,
                "collectionTitle" : element.collectionTitle, 
                "collectionCreated" : element.collectionCreated,
                "userId" : element.userId,
                "userName" : element.userName,
                "sessions": []
             }

            var session = {
                "userId" : element.userId,
                "sessionId" : element.sessionId,
                "sessionItemPath" : element.sessionItemPath,
                "sessionItemType" : element.sessionItemType,
                "sessionThumbnailPath" : element.sessionThumbnailPath,
                "height" : element.height, 
                "width" : element.width,
                "comments" : [], 
                "votes"  : []
             };

             if (element.voteUserId == userId){
                 session.myVote = vote;
             }

          var collectionIndex = -1, 
                sessionIndex = -1, 
                sessionIndexVote = -1;

          for (var i = 0; i<result.length; i++){
              if (result[i].collectionId == element.collectionId){
                  collectionIndex = i;
              }
          }

          if (collectionIndex == -1){

            addToArray(comment, "commentId", session.comments);
            addToArray(vote, "userId", session.votes);
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
                addToArray(vote, "userId", session.votes);
                addToArray(session, "sessionId", result[collectionIndex].sessions);

                sessionIndex = 0;

            }else{
                addToArray(comment, "commentId", result[collectionIndex].sessions[sessionIndex].comments);
                addToArray(vote, "userId", result[collectionIndex].sessions[sessionIndex].votes);
            }
          }

        };
          
        _(collections).forEach(nestCollection); 

        res.json(result);
        console.log(result)
    })
}



function create(req, res){

    const userId = req.auth.userId;
    const usersSharedWith = req.body.sharedWithUsers;

    const collection = models.tblcollections.build({
        collectionTitle : req.body.collectionTitle, 
        userId : userId
      }).save()
      .then(newCollection => {
       
        console.log("new collection created"); 

        // create a message object that is later used for notification on the creation of the collection
        
        // the following should be outsourced to the message.controller 

        /*
        let msgOption = {
            senderId : userId, 
            receivers : [],
            messageBody : "You have been invited to a new collection.", 
            linkUrl : {
                targetPage : 'ImgCollectionPage',
                params : {
                    collectionId : newCollection.collectionId
                }
            }, 
            isUnread : 1
        };
        */

        var groupUsers = [];

        // add all invitees to the group if there are some
        if (usersSharedWith){

            for (var i = 0; i<usersSharedWith.length; i++){

                let sharedUserId = usersSharedWith[i].userId; 

                let user = {
                    collectionId : newCollection.collectionId, 
                    userId : sharedUserId, 
                    userIdIsAuthor : 0
                }
                groupUsers.push(user)
                
                // add sharedUserIds to the receivers of a message
                //msgOption.receivers.push(sharedUserId);
            }
        }

        // add author to his group
        groupUsers.push({
            collectionId : newCollection.collectionId, 
            userId : userId, 
            userIdIsAuthor : 1
        })

        models.tblgroupusers.bulkCreate(groupUsers)
        .then(function(response){

            console.log("relvant groupusers created"); 
            
            res.json(response);

            // create messages and send push notifications through socket to respective users
            /*
            async function sendMessages() {
                try {

                    let createMessages = await messageCtrl.issueMessage(msgOption);
                    if (createMessages){
                        let message = await socketCtrl.joinActiveSocketsToGroup(groupUsers, newCollection );
                    }
                   
                }
                catch (error) {
                    console.log(error);
                }
            }

            (async () => {
                await sendMessages();
            })();
            
            
            return null;
            */
        })
        .catch(function(error){
            console.log(error);
            res.send(500, error);
        })

          return null;
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