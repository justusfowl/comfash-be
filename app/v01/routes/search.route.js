var express         = require('express'); 
var searchCtrl = require("../controllers/search.controller");
var router = express.Router(); 

router.route('/')

    .get(searchCtrl.searchUser)

router.route('/filtermeta')

    .get(searchCtrl.getSearchMetaData)

router.route('/outfits')

    .get(searchCtrl.searchOutfits)

router.route('/outfits/:outfitId')

    .get(searchCtrl.outfitMoreDetails)
    

module.exports =  router; 