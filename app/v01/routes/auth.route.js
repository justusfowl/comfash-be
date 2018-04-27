var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');
var config  = require('../../config/config');
var authCtrl = require("../auth/auth.controller");



var router = express.Router(); 

router.route('/')

    .post(authCtrl.checkLogin)

router.route('/f')

    .post(authCtrl.getFacebookServerToken, authCtrl.validateFacebookClientToken, authCtrl.getAuth0AccessToken)

router.route('/register')

    .post(authCtrl.registerUser)

module.exports = router;