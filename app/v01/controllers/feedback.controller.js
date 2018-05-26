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
                console.log("File image write error", err);
            }
    
            const feedback = models.tblfeedbacks.build({
                userId : userId, 
                feedbackText : feedbackText,
                screenshotPath : fileName, 
                feedbackStatus : 0
              }).save()
              .then(resultFeedback => {
                
                res.json(resultFeedback);
        
              })
              .catch(error => {
                // Ooops, do some error-handling
                console.log(error); 
                res.send(500, error);
                config.logger.error(error);
              })
    
        });
    }else{
        const feedback = models.tblfeedbacks.build({
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
            // Ooops, do some error-handling
            console.log(error); 
            res.send(500, error);
            config.logger.error(error);
          })
    }
  
}



async function notifyFeedback() {

  try {

      // notify uli
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
      console.log(error);
      config.logger.error(error);
  }
}



module.exports =   { submitFeedback };