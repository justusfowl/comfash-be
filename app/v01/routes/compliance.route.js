var express         = require('express'); 
var complaintCtrl = require("../controllers/complaint.controller");
var router = express.Router(); 

router.route('/complaint')

    // report and complain about an item
    .post(complaintCtrl.create)


module.exports =  router; 