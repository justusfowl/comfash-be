var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const config = require('../../config/config');


var verifyToken = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://comfash.eu.auth0.com/.well-known/jwks.json"
  }),
  aud: 'https://comfash.local:9999/api/v01',
  iss: "https://comfash.eu.auth0.com/",
  algorithms: ['RS256']
});


var successAuth = function(req, res, next) {


  req["auth"] = {
    userId: req.user["https://app.comfash.com/cf_id"]
  }


  next();

}


module.exports = { verifyToken, successAuth } ;