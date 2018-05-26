

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

            console.log('Labels:');
            labels.forEach(label => console.log(label.description));
            res.json(labels)
        })
        .catch(err => {
            res.send(500, err);
            console.error('ERROR:', err);
        });
    
}

// test function to issue to message broker for image recognition

function predict(req, res) {
  var input = [
    10, 20, 40, 100
  ]
  amqp.connect('amqp://' + config.mq.mqUser + ':' + config.mq.mqPassword + '@' + config.mq.mqServer + ':' + config.mq.mqPort, function (err, conn) {

      if (err){
          console.log(err); 

          res.send(500, err)
          return;
      }

    conn.createChannel(function (err, ch) {
      var simulations = 'simulations';
      ch.assertQueue(simulations, { durable: false });
      var results = 'results';
      ch.assertQueue(results, { durable: false });
      ch.sendToQueue(simulations, new Buffer(JSON.stringify(input)));
      ch.consume(results, function (msg) {
        res.send(msg.content.toString())
      }, { noAck: true });
    });
    setTimeout(function () { conn.close(); }, 500); 
    });
}


module.exports =   { predict };

