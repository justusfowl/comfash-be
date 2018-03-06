var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../config/config');

function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];

  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks expiration
  jwt.verify(token, config.auth.jwtSecret, function(err, decoded) {      
    if (err) 
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });    

    // if everything is good, save to request for use in other routes
    req.auth = {
        userId : decoded.userId
    };

    next();
  });

}

function verifyTokenSync (token){
  return jwt.verify(token, config.auth.jwtSecret);
}

module.exports = { verifyToken, verifyTokenSync } ;