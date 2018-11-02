var express         = require('express'); 
var feedbackCtrl = require("../controllers/feedback.controller");
var router = express.Router(); 

router.route('/')

    .post(feedbackCtrl.submitFeedback)

module.exports =  router; 