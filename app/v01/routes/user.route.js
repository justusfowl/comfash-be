var express         = require('express'); 
var userCtrl = require("../controllers/user.controller");
var messageCtrl = require ('../controllers/message.controller');
var signalCtrl = require ('../controllers/signal.controller');

var router = express.Router(); 

router.route('/')

    .get(userCtrl.searchUser)

router.route('/messages')

    .get(messageCtrl.list)

router.route('/messages/cntUnread')

    .get(messageCtrl.getNoUnread)

router.route('/messages/:messageId')

    .put(messageCtrl.updateMessageReadStatus)

router.route('/avatar')
    .post(userCtrl.upsertProfileAvatar)

router.route("/profile/:userId")
    .get(userCtrl.getUserProfileBase)

router.route('/push/registerDevice')
    
    .post(signalCtrl.registerDevice)

router.route('/follow/:userId')

    .post(userCtrl.toggleFollower)

module.exports =  router; 