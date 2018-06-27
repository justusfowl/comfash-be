var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var imgCollectionCtrl = require("../controllers/imgcollection.controller");
var sessionCtrl = require("../controllers/session.controller");
var commentCtrl = require("../controllers/comment.controller");
var voteCtrl = require ("../controllers/vote.controller");
var comparehistCtrl = require("../controllers/comparehist.controller"); 
var tagCtrl = require("../controllers/tag.controller");



var router = express.Router(); 

router.route('/')

    //.get(imgCollectionCtrl.listQry)

    .post(imgCollectionCtrl.create)

router.use('/room/:userId', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});


router.route('/room/:userId')

    .get(imgCollectionCtrl.listQry)

router.route('/myCollections')

    .get(imgCollectionCtrl.listMyCollections)

router.route('/sessions')

    .get(imgCollectionCtrl.listQry)

router.route('/shopSessions')

    .post(sessionCtrl.uploadCapturedShopSession)

router.route('/compare')

    .get(comparehistCtrl.listCompareHist)

router.route('/compare/:sessionId')

    .post(comparehistCtrl.upsertCompareHist)

    .delete(comparehistCtrl.deleteComparehist)

router.route('/:collectionId')

    .get(imgCollectionCtrl.listQry)

    .put(imgCollectionCtrl.update)

    .delete(imgCollectionCtrl.deleteItem)

router.route('/:collectionId/detail')

    .get(imgCollectionCtrl.listDetail)

router.route('/:collectionId/session')

    .get(sessionCtrl.list)

    .post(sessionCtrl.uploadVideo.single('file'), sessionCtrl.create)

router.route('/:collectionId/sessionImg')

    .post(sessionCtrl.uploadImageMw.single('file'), sessionCtrl.uploadImage)

router.route('/:collectionId/session/:sessionId')

    .get(imgCollectionCtrl.listQry)

    .delete(sessionCtrl.deleteSession)

router.route('/:collectionId/connectSession/:sessionId')

    .get(sessionCtrl.getSessionRelationInfo)

    .post(sessionCtrl.addSessionRelation)

    .delete(sessionCtrl.removeSessionRelation)

router.route('/:collectionId/session/:sessionId/comment')

    .get(commentCtrl.listCommentForSession)

    .post(commentCtrl.create)

router.route('/:collectionId/session/:sessionId/comment/:commentId')

    .delete(commentCtrl.deleteItem)

router.route('/:collectionId/session/:sessionId/vote')

    .post(voteCtrl.upsertVote)

    .delete(voteCtrl.deleteVote)

router.route('/:collectionId/session/:sessionId/tag')

    .post(tagCtrl.upsertTag)

router.route('/:collectionId/session/:sessionId/tag/:tagId')

    .delete(tagCtrl.deleteTag);


module.exports =  router; 