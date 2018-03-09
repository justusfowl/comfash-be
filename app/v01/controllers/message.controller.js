var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

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

                // create messages and send to respective recipients
                
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

    var qryOption = { raw: true, replacements: [userId, userId], type: models.sequelize.QueryTypes.SELECT}; 

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
        WHERE m.senderId = ? or m.receiverId = ?;'

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(messages => {

        res.json(messages);
        console.log(messages)
    })

}



module.exports = { list, issueMessage };