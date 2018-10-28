var models  = require('../models');
const path = require('path');
const multer = require('multer');
var config  = require('../../config/config');
var hash = require ('string-hash');
var fs = require('fs');
var config = require("../../config/config");
var signalCtrl = require('./signal.controller');

function submitFeedback(req, res){

    let userId = req.auth.userId; 
    let feedbackText = req.body.feedbackText;
    var screenShotData = req.body.screenShotData;

    if (screenShotData){
        var fileName =  '/feedback/'+ hash(userId) + "_fb_" + Date.now() + ".jpg";

        var resultPath = path.join(config.baseDir, fileName);
        
        let data = new Buffer(screenShotData, 'base64');
    
        fs.writeFile(resultPath, data, 'base64', function(err) {
            if (err){
                config.handleUniversalError(err, null, "File image write error");
            }
    
            models.tblfeedbacks.build({
                userId : userId, 
                feedbackText : feedbackText,
                screenshotPath : fileName, 
                feedbackStatus : 0
              }).save()
              .then(resultFeedback => {
                
                res.json(resultFeedback);
        
              })
              .catch(error => {
                config.handleUniversalError(error, res);
              })
    
        });
    }else{
        models.tblfeedbacks.build({
            userId : userId, 
            feedbackText : feedbackText,
            feedbackStatus : 0
          }).save()
          .then(resultFeedback => {
            
            res.json(resultFeedback);

            (async () => {
              // send notification to owner of the session
              await notifyFeedback();
  
          })();
  
            return null;
    
          })
          .catch(error => {
            config.handleUniversalError(error, res);
          })
    }
}

async function notifyFeedback() {

  try {

      // notify admin
      let userDevices = await signalCtrl.getUserDevices("a88dff2fc6698f332c8bff88c0e806d4");

      var message = {
          headings : {
              "en" : "Feedback"
          }, 
          contents: {
            "en" : "A user has given feedback on comfash"
        },
          include_player_ids: userDevices,
          ios_badgeType: 'Increase',
          ios_badgeCount: 1
        };

      if (userDevices.length > 0){
          signalCtrl.sendNotification(message);
      }
     
      return true;
     
  }
  catch (error) {
      config.handleUniversalError(error);
  }
}

module.exports =   { submitFeedback };