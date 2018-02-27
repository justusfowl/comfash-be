var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var userCtrl = require("../controllers/user.controller");

var router = express.Router(); 

router.route('/')

    .get(userCtrl.list)

    .post(userCtrl.create)


module.exports =  router; 