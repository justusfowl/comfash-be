var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var searchCtrl = require("../controllers/search.controller");

var router = express.Router(); 

router.route('/')

    .get(searchCtrl.searchUser)

router.route('/outfits')

    .get(searchCtrl.searchOutfits)

router.route('/outfits/:outfitId')

    .get(searchCtrl.outfitMoreDetails)
    

module.exports =  router; 