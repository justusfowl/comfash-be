var express         = require('express'); 
var streamCtrl = require("../controllers/stream.controller");

var router = express.Router(); 

router.route('/')

    .get(streamCtrl.getStream)


module.exports =  router; 