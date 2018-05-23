var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var searchCtrl = require("../controllers/search.controller");

var router = express.Router(); 

router.route('/')

    .get(searchCtrl.searchUser)

module.exports =  router; 