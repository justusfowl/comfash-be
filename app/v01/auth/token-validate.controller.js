var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var config = require('../../config/config');

var verifyToken = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: config.auth.jwksUri
  }),
  aud: config.auth.auth0_audience,
  iss: config.auth.iss,
  algorithms: ['RS256']
});

var successAuth = function(req, res, next) {
  req["auth"] = {
    userId: req.user["https://app.comfash.com/cf_id"]
  }
  next();
}

// Middleware for verification of client-2-server JWT
module.exports = { verifyToken, successAuth } ;