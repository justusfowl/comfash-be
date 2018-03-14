var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var socketCtrl = require('../socket/socket.controller');

async function notifyVote(sessionId, userId) {
    try {

        let groupUsers = await getMsgUserPerSession(sessionId);

        let collectionId = groupUsers[0].collectionId;

        let msgOption = {
            senderId : userId, 
            receivers : [],
            messageBody : "Someone voted for an outfit", 
            linkUrl : {
                targetPage : 'ContentPage',
                params : {
                    collectionId : collectionId, 
                    compareSessionIds : sessionId
                }
            }, 
            isUnread : 1
        };

        for (var i = 0; i<groupUsers.length; i++){
            if (groupUsers[i].userId != msgOption.sessionId){
                msgOption.receivers.push(groupUsers[i].userId);
            }
        }

        let messages = await issueMessage(msgOption);

        
        if (messages){
            let socketMessages = await socketCtrl.joinActiveSocketsToGroup(groupUsers, newCollection );
        }

        socketCtrl.emitMsgToGroup(collectionId, )

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

            msgOption.receivers.forEach(receiverId => {
                let newMessage = {
                    senderId : senderId, 
                    receiverId : receiverId,
                    messageBody : msgOption.messageBody, 
                    linkUrl : JSON.stringify(msgOption.linkUrl), 
                    isUnread : 1
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
        r.userName as receiverName\
        FROM cfdata.tblmessages as m\
        left join cfdata.tblusers as s ON m.senderId = s.userId\
        left join cfdata.tblusers as r ON m.receiverId = r.userId\
        WHERE m.receiverId = ?;'

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(messages => {

        res.json(messages);
        console.log(messages)
    })

}



module.exports = { list, issueMessage, getMsgUserPerSession, notifyVote };