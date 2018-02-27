var express    = require('express'); 
var imgCollectionRoutes = require('./imgcollection.route.js');
var userRoutes = require('./user.route.js');

var router = express.Router();


router.use('/imgcollection', imgCollectionRoutes ); 

router.use('/user', userRoutes ); 

module.exports =  router; 
