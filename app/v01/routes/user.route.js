var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var userCtrl = require("../controllers/user.controller");
var authController = require("../auth/auth.controller");
var messageCtrl = require ('../controllers/message.controller')


var router = express.Router(); 

router.route('/')

    .get(userCtrl.searchUser)

/*
router.route('/groups')
    .get(userCtrl.listGroups)
*/

router.route('/messages')

    .get(messageCtrl.list)

router.route('/avatar')
    .post(userCtrl.upsertProfileAvatar)

module.exports =  router; 