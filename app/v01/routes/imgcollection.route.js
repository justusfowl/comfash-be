/*var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var imgCollectionCtrl = require("../controllers/imgcollection.controller");
var sessionCtrl = require("../controllers/session.controller");

var router = express.Router(); 

router.route('/')

    .get(imgCollectionCtrl.listCollection)

    .post(validate(paramValidation.collection.create), imgCollectionCtrl.create)

router.route('/:collectionId')

    .get(imgCollectionCtrl.loadCollection)

    .delete(imgCollectionCtrl.remove)

router.route('/:collectionId/session')

    .post(sessionCtrl.addSession)

router.route('/:collectionId/session/:sessionId')

    .post(sessionCtrl.removeSession)

router.route('/:collectionId/session/:sessionId/comment')

    // hier das abrufen einzelner sessions möglich machen
    //.get(sessionCtrl.addSession)

    //.post(sessionCtrl.addSession)
router.route('/:collectionId/session/:sessionId/vote')


module.exports =  router; 
*/

var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var imgCollectionCtrl = require("../controllers/imgcollection.controller");
var sessionCtrl = require("../controllers/session.controller");
var imageCtrl = require("../controllers/image.controller");
var commentCtrl = require("../controllers/comment.controller");

var router = express.Router(); 

router.route('/')

    .get(imgCollectionCtrl.listQry)

    .post(imgCollectionCtrl.create)

router.route('/:collectionId')

    .get(imgCollectionCtrl.listQry)

    .delete(imgCollectionCtrl.deleteItem)

router.route('/:collectionId/session')

    .get(sessionCtrl.list)

    .post(sessionCtrl.create)

router.route('/:collectionId/session/:sessionId')

    .get(imgCollectionCtrl.listQry)

    // get specific data on session for sessionId
    .post(imageCtrl.create)

router.route('/:collectionId/session/:sessionId/comment')

    .post(commentCtrl.create)

router.route('/:collectionId/session/:sessionId/comment/:commentId')

    .delete(commentCtrl.deleteItem)

module.exports =  router; 