

var config  = require('../../config/config');
var amqp = require('amqplib/callback_api');


// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();


function predict_google (req, res) {

    var u = req; 
    var fileName = req.query.fileName;
    
    // Performs label detection on the image file
    client
        .labelDetection('./public/t/' + fileName)
        .then(results => {
            const labels = results[0].labelAnnotations;

            labels.forEach(label => console.log(label.description));
            res.json(labels)
        })
        .catch(err => {
            config.handleUniversalError(err, res);
        });
    
}

// test function to issue to message broker for image recognition

function predict(req, res) {

  var input = {
      "sessionThumbnailPath" : req.query.fileName, 
      "sessionId" : req.query.sessionId, 
      "origPath" : req.query.origPath, 
      "origEntity" : req.query.origEntity, 
      "sessionOwner" : req.query.sessionOwner
  }

  amqp.connect('amqp://' + config.mq.mqUser + ':' + config.mq.mqPassword + '@' + config.mq.mqServer + ':' + config.mq.mqPort, function (err, conn) {

      if (err){
        config.handleUniversalError(err, res);
        return;
      }

    conn.createChannel(function (err, ch) {
      var simulations = 'simulations';
      ch.assertQueue(simulations, { durable: false });
      var results = 'results';
      ch.assertQueue(results, { durable: false });
      ch.sendToQueue(simulations, new Buffer(JSON.stringify(input)));

      res.json({"message" : "ok"});
    });
    setTimeout(function () { conn.close(); }, 500); 
    });
}





module.exports =   { predict };

