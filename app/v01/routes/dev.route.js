var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var feedbackCtrl = require("../controllers/feedback.controller");


var router = express.Router(); 

router.route('/')

    .post(feedbackCtrl.submitFeedback)





module.exports =  router; 