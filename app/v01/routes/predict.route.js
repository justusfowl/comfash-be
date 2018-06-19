var express         = require('express'); 
var predictCtrl = require("../controllers/predict.controller");
var searchCtrl = require("../controllers/search.controller");

var router = express.Router(); 

router.route('/')

    .post(predictCtrl.predict)

module.exports =  router; 