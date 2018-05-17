var express         = require('express'); 
var validate        = require('express-validation');
var paramValidation  = require('../../config/validation');

var urlpreviewCtrl = require("../controllers/urlpreview.controller");

var router = express.Router(); 

router.route('/resolveUrl')

    // report and complain about an item
    .get(urlpreviewCtrl.resolveUrl);


module.exports =  router; 