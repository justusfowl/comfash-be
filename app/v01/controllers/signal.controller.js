var https = require('https');

var config = require('../../config/config'); 

var models  = require('../models');


var sendNotification = function(data) {

    // set appId to the message object 

    data.app_id = config.signal.appId;

    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic " + config.signal.restKey
    };
    
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
   
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };


async function getUserDevices (userId) {

    return new Promise(
        (resolve, reject) => {

            
            models.tbluserdevices.findAll({
                where: {
                    userId: userId
                }
            }).then(function(userDevices) {
                if (userDevices) {
                    let deviceList = userDevices.map(x => x.deviceToken);	
                    resolve(deviceList);
                } else {
                    reject("userDevices not defined")
                }
                }, function(error) {
                    config.logger.error(error);
                    reject(error)
            });
            
        }
    );

}

function registerDevice(req, res){

    let userId = req.auth.userId; 
    let deviceToken = req.body.userId;

    const device = models.tbluserdevices.upsert({
        userId: userId,
        deviceToken: deviceToken
    }).then(device => {
        res.json(device);
    })
    .catch(error => {
        config.handleUniversalError(error, res);
    })

}

module.exports = { sendNotification, registerDevice, getUserDevices };
