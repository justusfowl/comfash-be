var express             = require('express'); 

var imgCollectionRoutes = require('./imgcollection.route.js');
var userRoutes          = require('./user.route.js');
var authRoutes          = require('./auth.route.js');

var router = express.Router();

//middleware verification of token
var VerifyToken = require('../auth/token-validate.controller')

router.use('/imgcollection', VerifyToken, imgCollectionRoutes ); 

router.use('/user', userRoutes ); 

router.use('/auth', authRoutes );

module.exports = router; 
