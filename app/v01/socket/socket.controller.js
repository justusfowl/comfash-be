
var VerifyToken = require('../auth/token-validate.controller');
var models = require('../models');
var _ = require('lodash');

var logger = require("../../../logger").logger;


/**
 * Basic prefix of groups/rooms within the socket evironments
 */
var groupBase = 'group_';

/**
 * Function that corresponds to the disconnect event of a socket 
 * @param {*} socket 
 */
function handleDisconnect (socket){
    let userId; 
    if (socket.decoded_token){
         userId = socket.decoded_token.userId; 
    }else{
         userId = "UNBEKANNT?!?!"
    }
	console.log('A user disconnected from a socket: ' + userId);
};

/**
 * Emit message to a group of sockets that a userId is
 * @param {*} options 
 * @param {*} msg 
 */
function emitMsgToGroup(collectionId, msg){
    
    let groupName = groupBase + collectionId.toString(); 

    global.io.sockets.in(groupName).emit('msg', msg);

}
/**
 * Function that returns an array of socketIds that correspond to a given userId
 * @param {*} userId 
 */
function getSocketsForUserId(userId){

    var sockets = global.io.sockets.sockets;
    let results = [];

    _.map(sockets, function(value, key) {
        if ( value.decoded_token.userId == userId){
            results.push(key)
        }
        
      });

      return results;

}

/**
 * Joining active sockets to respective groups according to their userId based on their active authentication
 * @param { Array } users 
 * @param { number } collectionId 
 */
async function joinActiveSocketsToGroup(users, collection){

    let collectionId = collection.collectionId;

    return new Promise(
        (resolve, reject) => {

            console.log("joinActiveSocketsToGroup:" + users)
            
            users.forEach(user => {

                let sockets = getSocketsForUserId(user.userId); 

                sockets.forEach(socketId => {

                    let groupName = groupBase + collectionId.toString(); 
                    let mySocket = global.io.sockets.sockets[socketId]; 

                    mySocket.join(groupName);

                    // mySocket.emit('msg', "You have been invited to " + collection.collectionTitle + " in comfash");

                    global.config.logger.info("joining user " + user.userId + " to group: " + groupName);  

                });
                
            });
        resolve(true);
        }
    );
}
/**
 * Function to handle the connect of a socket to the server after it has authenticated with a valid JW-token
 * @param {*} socket 
 */
function handleConnect (socket){

    const userId = socket.decoded_token.userId;

    console.log('hello! ', socket.decoded_token.userId);

	//socket.emit("msg", 'hello! ' + socket.decoded_token.userId)
    
    models.tblgroupusers.findAll({
        where : {
            userId: userId
        }
    }).then(function(groups) {
        if (groups) {				
            

            groups.forEach(element => {

                let groupName = groupBase + element.collectionId.toString(); 

                socket.join(groupName);
                //socket.emit('msg', "joining you to group " + groupName + " in comfash");
                global.config.logger.info("joining user " + userId + " to group: " + groupName);
            });

        } else {
            console.warn("no groups found for user: " + userId)
        }
        }, function(error) {
            
            console.log(error)
    });
    
    socket.on('disconnect', handleDisconnect);
}




module.exports = { handleConnect, emitMsgToGroup, joinActiveSocketsToGroup };