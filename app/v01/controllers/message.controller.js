var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var _ = require('lodash');

var socketCtrl = require('../socket/socket.controller');
var userCtrl = require('./user.controller');
var sessionConnector = require('../connectors/session.connector');

var signalCtrl = require('./signal.controller');

var translateObj = require ('../../config/translations');

var util = require("../../util/util");

async function notifyVote(sessionId, userId) {
    try {

        let senderUserInfo = await userCtrl.getUserInfo(userId);
        let sessionInfo = await sessionConnector.getSessionInfo(sessionId);

        let receiverId = sessionInfo[0].userId;
        let senderName = senderUserInfo[0].userName;

        if (userId != receiverId){

            let userDevices = await signalCtrl.getUserDevices(receiverId);

            let collectionId = sessionInfo[0].collectionId;
            let collectionTitle = sessionInfo[0].collectionTitle;
    
            let translationOptions =  {
                userName : senderName,
                collectionTitle : collectionTitle 
            };
    
            let translations = translateObj.prepareItem(translationOptions, "VOTE_OWNER");
    
            let msgOption = {
                senderId : userId, 
                receivers : [receiverId],
                messageBody : translations.frontEndKey, 
                linkUrl : {
                    targetPage : 'ContentPage',
                    params : {
                        collectionId : collectionId, 
                        compareSessionIds : sessionId
                    }
                }, 
                isUnread : 1, 
                collectionId : collectionId, 
                sessionId : sessionId
            };
    
            var message = {
                headings : translations.headings, 
                contents: translations.content,
                data: {
                    linkUrl : msgOption.linkUrl,
                    senderName : senderName
                },
                include_player_ids: userDevices
              };
    
            if (userDevices.length > 0){
                signalCtrl.sendNotification(message);
            }
    
            let messages = await issueMessage(msgOption);
    
            if (messages){
                //let socketMessages = await socketCtrl.joinActiveSocketsToGroup(groupUsers, newCollection );
            }
        }
       

        return true;
       
    }
    catch (error) {
        console.log(error);
    }
}

async function notifyCollectionCreate(senderId, collectionTitle, groupUsers) {
    try {
        
        let senderUserInfo = await userCtrl.getUserInfo(senderId);
        let senderName = senderUserInfo[0].userName;

        let translationOptions =  {
            userName : senderName,
            collectionTitle : collectionTitle 
        };

        let translations = translateObj.prepareItem(translationOptions, "COLLECTION_INVITE");
        
        let collectionId; 

        let receiverIds = []; 

        _.filter(groupUsers, function(o) { 
            if (o.userIdIsAuthor == 0){
                receiverIds.push(o.userId);
                collectionId = o.collectionId;
            }
         });

        let msgOption = {
            senderId : senderId, 
            receivers : receiverIds,
            messageBody : translations.frontEndKey, 
            linkUrl : {
                targetPage : 'ImgCollectionPage',
                params : {
                    collectionId : collectionId
                }
            }, 
            isUnread : 1, 
            collectionId : collectionId
        };

        let messages = await issueMessage(msgOption);

        if (messages){
            console.log("messages true! :) ")
        }

        // iterate over all receiverIds 
        for (var i=0; i<receiverIds.length; i++){

            let receiverId = receiverIds[i]; 
            let userDevices = await signalCtrl.getUserDevices(receiverId);

            var message = {
                headings : translations.headings, 
                contents: translations.content,
                data: {
                    linkUrl : msgOption.linkUrl,
                    senderName : senderName
                },
                include_player_ids: userDevices
              };
    
            if (userDevices.length > 0){
                signalCtrl.sendNotification(message);
            }

        }

        return true;
       
    }
    catch (error) {
        console.log(error);
    }
}

async function notifySessionCreate(senderId, sessionId) {
    try {
        
        let senderUserInfo = await userCtrl.getUserInfo(senderId);

        let senderName = senderUserInfo[0].userName;

        let sessionInfo = await sessionConnector.getSessionInfo(sessionId);
        let collectionId = sessionInfo[0].collectionId;
        let collectionTitle = sessionInfo[0].collectionTitle;


        let groupUsers = await getMsgUserPerSession(sessionId);

        let translationOptions =  {
            userName : senderName,
            collectionTitle : collectionTitle 
        };

        let translations = translateObj.prepareItem(translationOptions, "SESSION_CREATE");

        let receiverIds = []; 

        _.filter(groupUsers, function(o) { 
            if (o.userIdIsAuthor == 0){
                receiverIds.push(o.userId);
            }
         });

        let msgOption = {
            senderId : senderId, 
            receivers : receiverIds,
            messageBody : translations.frontEndKey, 
            linkUrl : {
                targetPage : 'ImgCollectionPage',
                params : {
                    collectionId : collectionId
                }
            }, 
            isUnread : 1, 
            collectionId : collectionId
        };

        let messages = await issueMessage(msgOption);

        if (messages){
            console.log("messages true! :) ")
        }

        // iterate over all receiverIds 
        for (var i=0; i<receiverIds.length; i++){

            let receiverId = receiverIds[i]; 
            let userDevices = await signalCtrl.getUserDevices(receiverId);

            var message = {
                headings : translations.headings, 
                contents: translations.content,
                data: {
                    linkUrl : msgOption.linkUrl,
                    senderName : senderName
                },
                include_player_ids: userDevices
              };
    
            if (userDevices.length > 0){
                signalCtrl.sendNotification(message);
            }

        }

        return true;
       
    }
    catch (error) {
        console.log(error);
    }
}

async function getMsgUserPerSession (sessionId) {
    
    return new Promise(
        (resolve, reject) => {


            var qryOption = { raw: true, replacements: [sessionId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT u.userId, u.userIdIsAuthor, s.sessionId, s.collectionId FROM \
            cfdata.tblsessions as s\
            left join cfdata.tblgroupusers as u on s.collectionId = u.collectionId \
            where s.sessionId = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(groupusers => {

                resolve(groupusers);

            })
        }
    );
    
}

/**
 * function to create messages into database
 * @param {*} msgOption
 * 
 *         let msgOption = {
            senderId : userId, 
            receivers : [receiverId1, receiverId2,...],
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
async function issueMessage(msgOption) {
    return new Promise(
        (resolve, reject) => {

            let messages = [];
            let senderId = msgOption.senderId;
            let collectionId = msgOption.collectionId || null;
            let sessionId = msgOption.sessionId || null;

            msgOption.receivers.forEach(receiverId => {
                let newMessage = {
                    senderId : senderId, 
                    receiverId : receiverId,
                    messageBody : msgOption.messageBody, 
                    linkUrl : JSON.stringify(msgOption.linkUrl), 
                    isUnread : 1, 
                    collectionId: collectionId, 
                    sessionId: sessionId
                }
                messages.push(newMessage);
            });


            models.tblmessages.bulkCreate(messages)
            .then(function(response){

                console.log("relvant messages created"); 
                
                resolve(true);
                return null;
            })
            .catch(function(error){
                console.log(error);
                reject (false)
            })

        
        }
    
    );
};


function list (req,res) {

    let userId = req.auth.userId; 

    var qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 

    let topStr = util.getLimitOffsetForQryStr(req);

    let qryStr = '\
        SELECT \
        m.messageId,\
        m.messageBody, \
        m.linkUrl, \
        m.messageCreated, \
        m.isUnread, \
        s.userName as senderName,\
        s.userAvatarPath as senderAvatarPath,\
        r.userName as receiverName,\
        sess.sessionThumbnailPath, \
        col.collectionTitle \
        FROM cfdata.tblmessages as m\
        left join cfdata.tblusers as s ON m.senderId = s.userId\
        left join cfdata.tblusers as r ON m.receiverId = r.userId\
        left join cfdata.tblsessions as sess ON m.sessionId = sess.sessionId \
        left join cfdata.tblcollections as col ON m.collectionId = col.collectionId \
        WHERE m.receiverId = ? \
        ORDER BY m.messageCreated DESC \
        ' + topStr + ';';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(messages => {

        res.json(messages);
        console.log(messages)
    })

}

function getNoUnread(req, res){

    let userId = req.auth.userId;

    models.tblmessages.count({ where: {'receiverId': userId, "isUnread" : 1} }).then(c => {
        res.json({"isUnreadCnt" : c});
      })

}

function updateMessageReadStatus(req, res){

    console.log("HIER NOCH AUTHORISIERUNG AUF EIGENE MESSAGES EINSCHRÄNKEN");

    let messageId = req.params.messageId;
    let messageIsRead = req.body.isUnread;

    models.tblmessages.update({
        isUnread: messageIsRead
      }, {
        where: { messageId: messageId }
      }).then(function(message) {
        if (message) {				
            res.json(message);
        } else {
            res.send(401, "message not found");
        }
        }, function(error) {
            
        res.send("message not found");
    });

}



module.exports = { 
    list, 
    issueMessage, 
    getMsgUserPerSession, 
    notifyVote, 
    notifyCollectionCreate, 
    notifySessionCreate,
    updateMessageReadStatus, 
    getNoUnread
};