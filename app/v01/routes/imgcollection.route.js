var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var imgCollectionCtrl = require("../controllers/imgcollection.controller");
var sessionCtrl = require("../controllers/session.controller");
var commentCtrl = require("../controllers/comment.controller");
var voteCtrl = require ("../controllers/vote.controller");

var router = express.Router(); 

router.route('/')

    .get(imgCollectionCtrl.listQry)

    .post(imgCollectionCtrl.create)

router.route('/:collectionId')

    .get(imgCollectionCtrl.listQry)

    .delete(imgCollectionCtrl.deleteItem)

router.route('/:collectionId/session')

    .get(sessionCtrl.list)

    .post(sessionCtrl.uploadVideo.single('file'), sessionCtrl.create)

router.route('/:collectionId/session/:sessionId')

    .get(imgCollectionCtrl.listQry)

    .delete(sessionCtrl.deleteSession)

router.route('/:collectionId/session/:sessionId/comment')

    .post(commentCtrl.create)

router.route('/:collectionId/session/:sessionId/comment/:commentId')

    .delete(commentCtrl.deleteItem)

router.route('/:collectionId/session/:sessionId/vote')

    .post(voteCtrl.upsertVote)

    .delete(voteCtrl.deleteVote)

module.exports =  router; 