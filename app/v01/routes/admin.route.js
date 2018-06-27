var express         = require('express'); 
var config  = require('../../config/config');
var adminCtrl = require('../controllers/admin.controller')

var router = express.Router(); 

router.route('/')

    .post(adminCtrl.hb)

router.route('/crawl')

    .post(adminCtrl.uploadImageMw.single('file'), adminCtrl.addCrawlSession)

router.route('/searchmeta')

    .get(adminCtrl.getSearchItem)

    .post(adminCtrl.approveSearchItem)

router.route('/searchmeta/:id')
    .delete(adminCtrl.rejectSearchItem)
    
router.route('/searchmeta/metadata')

    .get(adminCtrl.getSearchMetaData)

module.exports = router;