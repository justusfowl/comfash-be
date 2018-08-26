var express         = require('express'); 
var config  = require('../../config/config');
var adminCtrl = require('../controllers/admin.controller');
var searchCtrl = require('../controllers/search.controller');
var authCtrl = require("../auth/auth.controller");
var router = express.Router(); 
var VerifyToken = require('../auth/token-validate.controller');

router.route('/')

    .post(adminCtrl.hb)

router.route('/crawl')

    .post(adminCtrl.uploadImageMw.single('file'), adminCtrl.addCrawlSession)

router.route('/searchmeta')

    .get(adminCtrl.getSearchItem)

    .post(VerifyToken.verifyToken, VerifyToken.successAuth, adminCtrl.approveSearchItem)

router.route('/searchmeta/:id')
    .delete(adminCtrl.rejectSearchItem)
    
router.route('/searchmeta/metadata')

    .get(searchCtrl.getSearchMetaData)

router.route('/searchmeta/grouplabels')

    .get(adminCtrl.getGroupLabelsInfo)

module.exports = router;