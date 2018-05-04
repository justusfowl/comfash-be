var express             = require('express'); 

var imgCollectionRoutes = require('./imgcollection.route.js');
var userRoutes          = require('./user.route.js');
var authRoutes          = require('./auth.route.js');
var streamRoutes        = require('./stream.route.js');
var complianceRoutes        = require('./compliance.route.js');

var router = express.Router();

//middleware verification of token
var VerifyToken = require('../auth/token-validate.controller');

router.use('/hb', function (req, res){
    res.json({"response": "healthy"})
});

router.use('/imgcollection', [VerifyToken.verifyToken, VerifyToken.successAuth], imgCollectionRoutes ); 

router.use('/user', [VerifyToken.verifyToken, VerifyToken.successAuth], userRoutes ); 

router.use('/stream', [VerifyToken.verifyToken, VerifyToken.successAuth], streamRoutes ); 

router.use('/auth', authRoutes );

router.use('/compliance', [VerifyToken.verifyToken, VerifyToken.successAuth], complianceRoutes );



module.exports = router; 
