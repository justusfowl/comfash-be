var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var userCtrl = require("../controllers/user.controller");
var authController = require("../auth/auth.controller");


var router = express.Router(); 

router.route('/')

    .get(userCtrl.list)

    .post(authController.registerUser)


router.route('/groups')

    .get(userCtrl.listGroups)


module.exports =  router; 