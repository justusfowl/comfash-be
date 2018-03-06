var models  = require('../models');


function issueMessage(socket, msgOption){

     hier: gruppe aus req.params.collectionId

     --> get groupId from collectionID 

     --> get users associated

     --> create message und mache bulkCreate

     --> emit an room

     --> toDo: push notification 

    if (msgOption.group != null){


    }else{


    }
    
    const message = models.tblmessages.build({
        senderId : msgOption.senderId,
        receiverId: msgOption.receiverId,
        messageBody : msgOption.messageBody,
        linkUrl : msgOption.linkUrl,
        isUnread : 0
    }).save()
    .then(anotherTask => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 

        .io.emit('newCollection', "new collection created: " + req.body.collectionTitle);

        res.json(collection);
    })
    .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
    })

}

module.exports = { list, listGroups};