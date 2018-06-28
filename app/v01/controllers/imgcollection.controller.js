var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var socketCtrl = require('../socket/socket.controller');
var messageCtrl = require('../controllers/message.controller');
var groupUserCtrl = require('../controllers/groupuser.controller');
var _ = require("lodash");

var collectionConnector = require('../connectors/collection.connector');

var config = require("../../config/config");


function addToArray (obj, key, array){

    let index = array.findIndex(x => x[key] === obj[key])

    if (obj[key]!=null && index == -1){
        array.push(obj); 

    }
}


function listMyCollections (req,res) {

    let userId = req.auth.userId;
    

    var qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 
    
    let qryStr = 'SELECT c.* FROM cfdata.tblcollections as c  \
    where c.userId = ?  \
    ORDER BY c.collectionCreated DESC';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(myCollections => {

        res.json(myCollections);

    }).catch(error => {
        config.logger.error(error);
    })

}


function listQry (req,res) {


    let userId, whereStr, qryOption; 
    let isSessionRequested = false;

    userId = req.params.userId;

    let requestUserId = req.auth.userId;


    let qryStr = 'SELECT \
    c.*, \
    colUs.userName, \
    colUs.userAvatarPath as userAvatarPath, \
    s.sessionId, \
    s.sessionCreated, \
    s.sessionItemPath, \
    s.sessionItemType,\
    s.sessionThumbnailPath,\
    s.width,\
    s.height,\
    s.primeColor,\
    s.primeFont, \
    s.filterOption, \
    s.isMySession, \
    co.commentId, \
    co.commentText, \
    co.commentCreated, \
    co.xRatio, \
    co.yRatio, \
    co.userId as commentUserId, \
    co.prcSessionItem, \
    us.userName as commentUserName, \
    us.userAvatarPath as commentUserAvatarPath, \
    v.voteType, \
    v.voteChanged, \
    v.userId as voteUserId, \
    g.userIdIsAuthor as priv, \
    t.tagId, \
    t.tagUrl, \
    t.xRatio as tagXRatio, \
    t.yRatio as tagYRatio, \
    t.tagBrand, \
    t.tagImage, \
    t.tagSeller, \
    t.tagTitle \
    FROM tblcollections c\
    LEFT JOIN (\
        select *, 1 as isMySession FROM tblsessions\
        UNION ALL\
        select \
        sess.sessionId,\
        sess.sessionCreated, \
        rel.targetCollectionId as collectionId,\
        sess.sessionItemPath,\
        sess.sessionItemType,\
        sess.sessionThumbnailPath,\
        sess.width,\
        sess.height,\
        sess.primeColor, \
        sess.primeFont, \
        sess.filterOption,\
        0 as isMySession \
        FROM tblsessions as sess\
        INNER JOIN (\
        SELECT * FROM \
        cfdata.tblsessionrelations\
        where {target_column_relations_filter} = ?) as rel on sess.sessionId = rel.sourceSessionId\
    ) s on c.collectionId = s.collectionId\
    LEFT JOIN tblcomments co on s.sessionId = co.sessionId \
    LEFT JOIN tbltags t on s.sessionId = t.sessionId \
    LEFT JOIN tblusers us on co.userId = us.userId\
    LEFT JOIN tblusers colUs on c.userId = colUs.userId\
    LEFT JOIN (SELECT * FROM tblgroupusers WHERE userId = ? ) as g on c.collectionId = g.collectionId \
    LEFT JOIN tblvotes v on s.sessionId = v.sessionId ';

    whereStr = ' WHERE (g.userIdIsAuthor is not null or c.privacyStatus = 0 or c.privacyStatus = 3) AND ';
    qryOption = { raw: true, replacements: [requestUserId], type: models.sequelize.QueryTypes.SELECT}; 


    if (req.params.collectionId){

        // if collectionId is defined and requested then add this to the session-relation nested join 

        qryOption.replacements.unshift(req.params.collectionId)
        qryStr = qryStr.replace("{target_column_relations_filter}", "targetCollectionId")
        
        whereStr += ' c.collectionId = ? ';
        qryOption.replacements.push(req.params.collectionId);

        if (req.params.sessionId){
            whereStr += " AND s.sessionId = ? "
            qryOption.replacements.push(req.params.sessionId);
        }
         
    }
    else if (req.query.session){

        // WARNING: The following is a work-around to not include any sessions from the sessionrelations table
        qryOption.replacements.unshift(1)
        qryStr = qryStr.replace("{target_column_relations_filter}", "0")

        isSessionRequested = true;
        whereStr += ' s.sessionId in ( ';

        let reqSessionIds = req.query.session;

        if (typeof(reqSessionIds) == 'object'){
            for (var i=0; i<reqSessionIds.length; i++){
                whereStr += '?';
    
                if (i != (reqSessionIds.length - 1)){
                    whereStr += ','
                }
    
                qryOption.replacements.push(reqSessionIds[i]);
            }
        }else if (typeof(reqSessionIds) == 'string'){
            whereStr += '?';
            qryOption.replacements.push(reqSessionIds);
        }

        whereStr += ") "

    }
    else{

        // if userId is defined and requested then add this to the session-relation nested join 

        qryOption.replacements.unshift(userId)
        qryStr = qryStr.replace("{target_column_relations_filter}", "userId")
        
        whereStr += ' c.userId = ?';
        qryOption.replacements.push(userId);
    }


    
    qryStr += whereStr +
    ' ORDER BY c.collectionId, s.sessionCreated desc, co.commentId;';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(collections => {

        var result = [];
        var allSessions = [];

        var nestCollection = function(element) {
            
            var comment  = {
                "commentId" : element.commentId, 
                "commentText" : element.commentText,
                "commentUserId" : element.commentUserId,
                "commentCreated" : element.commentCreated, 
                "xRatio": element.xRatio,
                "yRatio" : element.yRatio, 
                "prcSessionItem" : element.prcSessionItem, 
                "commentUserName" : element.commentUserName, 
                "commentUserAvatarPath" : element.commentUserAvatarPath
               };

            var vote = {
                "sessionId" : element.sessionId, 
                "voteType" : element.voteType,
                "voteChanged" : element.voteChanged,
                "userId" : element.voteUserId
               };

            
            var tag = {
                "tagId" : element.tagId, 
                "tagUrl" : element.tagUrl,
                "xRatio" : element.tagXRatio,
                "yRatio" : element.tagYRatio, 
                "tagTitle" : element.tagTitle, 
                "tagBrand" : element.tagBrand, 
                "tagSeller" : element.tagSeller, 
                "tagImage" : element.tagImage
               };

            var collection = {
                "collectionId" : element.collectionId,
                "collectionTitle" : element.collectionTitle, 
                "collectionDescription" : element.collectionDescription, 
                "collectionCreated" : element.collectionCreated,
                "userId" : element.userId,
                "userName" : element.userName,
                "privacyStatus" : element.privacyStatus,
                "sessions": []
             }

            var session = {
                "userId" : element.userId,
                "userName" : element.userName,
                "userAvatarPath" : element.userAvatarPath,
                "collectionId" : element.collectionId,
                "collectionTitle" : element.collectionTitle, 
                "sessionId" : element.sessionId,
                "sessionItemPath" : element.sessionItemPath,
                "sessionItemType" : element.sessionItemType,
                "sessionThumbnailPath" : element.sessionThumbnailPath,
                "height" : element.height, 
                "width" : element.width,
                "primeColor" : element.primeColor,
                "primeFont" : element.primeFont,
                "filterOption" : element.filterOption,
                "isMySession" : element.isMySession,
                "comments" : [], 
                "votes"  : [], 
                "tags" : []
             };

            if (element.voteUserId == requestUserId){
                session.myVote = vote;
            }
            
            if (session.isMySession){
                if (element.userId == requestUserId){
                    session.isMySession = true;
                }else{
                    session.isMySession = false;
                }
            }else{
                session.isMySession = false;
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
            addToArray(tag, "tagId", session.tags);
            addToArray(session, "sessionId", collection.sessions);
            addToArray(session, "sessionId", allSessions);

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
                addToArray(tag, "tagId", session.tags);
                addToArray(session, "sessionId", result[collectionIndex].sessions);
                addToArray(session, "sessionId", allSessions);

                sessionIndex = 0;

            }else{
                addToArray(comment, "commentId", result[collectionIndex].sessions[sessionIndex].comments);
                addToArray(tag, "tagId",  result[collectionIndex].sessions[sessionIndex].tags);
                addToArray(vote, "userId", result[collectionIndex].sessions[sessionIndex].votes);
            }
          }

        };
          
        _(collections).forEach(nestCollection);

        // calculate voting stats
        
        _(result).forEach(function (collection){

            _(collection.sessions).forEach(function (session){

                let votes = session.votes;
                let comments = session.comments;

                let count = votes.length; 
                let avg = _.meanBy(votes, 'voteType');

                let countComments = comments.length; 


                session["voteCnt"] = count;
                session["voteAvg"] = avg;

                session["commentCnt"] = countComments;
            });


        });

        if (isSessionRequested){
            res.json(allSessions);
            console.log(allSessions)

        }else{
            res.json(result);
            console.log(result);
        }

    }).catch(error => {
        config.logger.error(error);
    })
}

function listDetail (req,res) {

    let userId, collectionId, whereStr, qryOption; 

    collectionId = req.params.collectionId;
    userId = req.auth.userId;

    whereStr = ' WHERE c.userId = ? and c.collectionId = ? ';
    qryOption = { raw: true, replacements: [userId, collectionId], type: models.sequelize.QueryTypes.SELECT}; 

    let qryStr = 'SELECT \
            c.*, \
            g.userId as groupUserId, \
            g.userIdIsAuthor, \
            u.userName as groupUserName, \
            u.userAvatarPath as groupUserAvatarPath \
            FROM cfdata.tblgroupusers as g \
            inner join cfdata.tblcollections as c on g.collectionId = c.collectionId \
            inner join cfdata.tblusers as u on g.userId = u.userId \
            '
            + whereStr + ';';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(collection => {

        let collectionDetails;
        let sharedWithUsers = [];

        if (collection.length > 0){
            _(collection).forEach(function (groupUser){

                if (groupUser.userIdIsAuthor == 1){
                    collectionDetails = {
                        "collectionId" : groupUser.collectionId,
                        "collectionTitle" : groupUser.collectionTitle,
                        "collectionDescription" : groupUser.collectionDescription,
                        "privacyStatus" : groupUser.privacyStatus
                    }
                }else{
                    sharedWithUsers.push({
                        "userId" : groupUser.groupUserId, 
                        "userName" : groupUser.groupUserName,
                        "userAvatarPath" : groupUser.groupUserAvatarPath
                    })
                }
    
            });
    
            collectionDetails["sharedWithUsers"] = sharedWithUsers;
            res.json(collectionDetails);
            console.log(collectionDetails)
        }else{
            res.json([]);
            console.log([])
        }
       
    }).catch(error => {
        config.logger.error(error);
    })
}

function update(req, res){

    let collectionId = req.params.collectionId;
    let userId = req.auth.userId; 

    const collectionTitle = req.body.collectionTitle;
    const collectionDesc = req.body.collectionDescription;
    const privacyStatus = req.body.privacyStatus; 
    const usersSharedWith = req.body.sharedWithUsers;

    (async () => {
            

        let collectionInfo = await collectionConnector.getCollectionInfo(collectionId);

        if (collectionInfo.length > 0){

            if (collectionInfo[0].userId == userId){

                const collection = models.tblcollections.update(
                    {        
                        collectionTitle : collectionTitle, 
                        collectionDescription : collectionDesc,
                        privacyStatus : privacyStatus,
                    },
                    {returning: true, where: {collectionId: collectionId} }
                ).then(collection => {
            
                    console.log("collection updated"); 
                    (async () => {

                        let addedGroupUsers = await groupUserCtrl.deltaLoadGroupUsers(collectionId, userId, usersSharedWith);

                        res.json(collection);

                    
                        let collectionInfo = await collectionConnector.getCollectionInfo(collectionId);
                        await messageCtrl.notifyCollectionCreate(userId, collectionInfo[0].collectionTitle, addedGroupUsers)
                    })();
                    
                    
                    return null;
                    
                })
                .catch(error => {
                    // Ooops, do some error-handling
                    console.log(error);
                    config.logger.error(error);
                    res.send(500, error);
                })


            }else{
                res.send(401, "Not authorized to update this collection");
            }
        }else{
            res.send(404, "Not found");
        }

        return true;
        
   
    })();

    
}


function create(req, res){

    const userId = req.auth.userId;
    
    const collectionTitle = req.body.collectionTitle;
    const collectionDesc = req.body.collectionDescription;
    const privacyStatus = req.body.privacyStatus; 
    const usersSharedWith = req.body.sharedWithUsers;

    const collection = models.tblcollections.build({
        collectionTitle : collectionTitle, 
        collectionDescription : collectionDesc,
        privacyStatus : privacyStatus,
        userId : userId
      }).save()
      .then(newCollection => {


        (async () => {

            let addedGroupUsers = await groupUserCtrl.bulkInsertGroupUsers(userId, newCollection.collectionId, usersSharedWith, true);

            res.json(newCollection);

            await messageCtrl.notifyCollectionCreate(userId, collectionTitle, addedGroupUsers);

        })();


          return null;
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        config.logger.error(error);
        res.send(500, error);
      })

}

function deleteItem(req, res){

    let userId = req.auth.userId; 

    models.tblcollections.destroy({
        where: {
            collectionId: req.params.collectionId, 
            userId : userId
          }
    }).then(function(collection) {
        if (collection) {				
            res.json(collection);
        } else {
            res.send(401, "User not found");
        }
        }, function(error) {
            
        res.send("User not found");
    }).catch(error => {
        config.logger.error(error);  
    });

}

module.exports =   { listMyCollections, listQry, listDetail, create, update, deleteItem };