var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var authCtrl = require("../auth/auth.controller");

var router = express.Router(); 

router.route('/')

    .post(authCtrl.checkLogin)

router.route('/register')

    .post(authCtrl.registerUser)

module.exports = router;