
const config = require('../../config/config');


// Middleware for Server-2-Server communication with static secret 

var validateApiSecret = function(req, res, next) {
    let secret = req.headers.api_secret;

    if (secret == config.auth.api_secret){
        next();
    }else{
        res.send(401, "Unauthorized");
    }
}
module.exports = { validateApiSecret } ;