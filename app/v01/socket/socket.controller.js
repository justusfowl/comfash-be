
var VerifyToken = require('../auth/token-validate.controller');
var models = require('../models');


function handleDisconnect (socket){
	console.log('a user disconnected');
	console.log(socket)
	console.log('a user disconnected END');
};

function handleConnect (socket){

    const userId = socket.decoded_token.userId;

    console.log('hello! ', socket.decoded_token.userId);

	socket.emit("msg", 'hello! ' + socket.decoded_token.userId)
    
    // get groups where user is member

    // join the socket in those rooms

    models.tblgroupusers.findAll({
        where : {
            userId: userId
        }
    }).then(function(groups) {
        if (groups) {				
            

            groups.forEach(element => {

                let groupName = 'group_'+element.groupId.toString(); 

                socket.join(groupName);
                socket.emit('msg', "joining you to group " + groupName + " in comfash");
                console.log("joining user " + userId + " to group: " + groupName);
            });
            
            

        } else {
            console.warn("no groups found for user: " + userId)
        }
        }, function(error) {
            
            console.log(error)
    });
    
    /*
	socket.on('groupjoin', function(rooms) {

		console.log("Trying to join room");

		rooms.forEach(element => {
			socket.join('group_'+element.groupId.toString());
		});
		
		socket.emit('msg', "joining you to groups in comfash");

	});

	socket.emit('msg', "connected to comfash");

	socket.on('con', function (data){
		console.log(data);
	});

	socket.on('msgGroup')

	socket.emit('connection', 'welcome to comfash');


        */
    console.log('a user CONNECTED: ' + socket);
    
    socket.on('disconnect', handleDisconnect);
}




module.exports = { handleConnect };