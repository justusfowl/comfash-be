var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var complaintCtrl = require("../controllers/complaint.controller");

var router = express.Router(); 

router.route('/complaint')

    // report and complain about an item
    .post(complaintCtrl.create)


module.exports =  router; 