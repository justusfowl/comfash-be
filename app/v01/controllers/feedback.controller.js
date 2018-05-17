var models  = require('../models');
const path = require('path');
const multer = require('multer');
var config  = require('../../config/config');
var hash = require ('string-hash');
var fs = require('fs');


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
    
          })
          .catch(error => {
            // Ooops, do some error-handling
            console.log(error); 
            res.send(500, error);
          })
    }
    


}

module.exports =   { submitFeedback };