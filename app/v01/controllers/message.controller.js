var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;


var socketCtrl = require('../socket/socket.controller');
var userCtrl = require('./user.controller');
var sessionCtrl = require('./session.controller');

var signalCtrl = require('./signal.controller');

async function notifyVote(sessionId, userId) {
    try {
        
        let userDevices = await signalCtrl.getUserDevices(userId);




        let senderUserInfo = await userCtrl.getUserInfo(userId);
        let sessionInfo = await sessionCtrl.getSessionInfo(sessionId);

        let receiverId = sessionInfo[0].userId;
        let senderName = senderUserInfo[0].userName;

        let collectionId = sessionInfo[0].collectionId;
        let collectionTitle = sessionInfo[0].collectionTitle;

        let msgOption = {
            senderId : userId, 
            receivers : [receiverId],
            messageBody : senderName + " has voted for your outfit in #" + collectionTitle, 
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
            headings : { "en" : "FittingStreamUpdate"}, 
            contents: {"en": "Voting"},
            data: msgOption.linkUrl,
            include_player_ids: userDevices
          };

        if (userDevices.length > 0){
            signalCtrl.sendNotification(message);
        }

        let messages = await issueMessage(msgOption);

        if (messages){
            //let socketMessages = await socketCtrl.joinActiveSocketsToGroup(groupUsers, newCollection );
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

    let qryStr = '\
        SELECT \
        m.messageId,\
        m.messageBody, \
        m.linkUrl, \
        m.messageCreated, \
        m.isUnread, \
        s.userName as senderName,\
        r.userName as receiverName,\
        sess.sessionThumbnailPath \
        FROM cfdata.tblmessages as m\
        left join cfdata.tblusers as s ON m.senderId = s.userId\
        left join cfdata.tblusers as r ON m.receiverId = r.userId\
        left join cfdata.tblsessions as sess ON m.sessionId = sess.sessionId \
        WHERE m.receiverId = ? \
        ORDER BY m.messageCreated DESC ;'

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(messages => {

        res.json(messages);
        console.log(messages)
    })

}

function markMessageRead(req, res){

    console.log("HIER NOCH AUTHORISIERUNG AUF EIGENE MESSAGES EINSCHRÄNKEN");

    let messageId = req.params.messageId;

    models.tblmessages.update({
        isUnread: 0
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



module.exports = { list, issueMessage, getMsgUserPerSession, notifyVote, markMessageRead };