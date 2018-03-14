var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var streamCtrl = require("../controllers/stream.controller");

var router = express.Router(); 

router.route('/')

    .get(streamCtrl.getStream)


module.exports =  router; 