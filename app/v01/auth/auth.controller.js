
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const config = require('../../config/config');
var models = require('../models');
const uuidv1 = require('uuid/v1');                                                                                                                                                           
const https = require('https');
var crypto = require('crypto');

function getFacebookServerToken(req, res, next){

    var path = "/oauth/access_token?client_id=" + config.facebook.app_id + "&client_secret=" + config.facebook.app_secret + "&grant_type=client_credentials"
        
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
           'Content-Type': 'application/json'
         }
    };
    
    var request = https.request(options, (response) => {

      response.on('data', function(data) {
        var resData = JSON.parse(data);
        req["auth_fb"] = {
           "server_token" :  resData.access_token
        }
        next();

      });

    });
    
    request.on('error', (e) => {
      config.logger.error(e);
    });
    
    request.end();

}

function validateFacebookClientToken(req, res, next){

    var fbToken = req.body.fb_access_token;

    var path = "/debug_token?input_token=" + fbToken + "&access_token=" + req.auth_fb.server_token;
        
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
           'Content-Type': 'application/json'
         }
    };
    
    var request = https.request(options, (response) => {

      response.on('data', function(data) {

        var resData = JSON.parse(data);

        req["auth_fb"] = {
           "token_payload" :  resData.data
        }

        if (!resData.data.is_valid){
            res.send(401, "Unauthorized facebook login");
        }

        next();

      });

    });
    
    request.on('error', (e) => {
      config.logger.error(e);
    });
    
    request.end();

}




/**
 * After successfully validating facebook accessToken / login, acquire auth0 access-Token and send back to client for profile acquisition
 * @param {*} req 
 * @param {*} res 
 */
function getAuth0AccessToken(req, res){

    var postData = JSON.stringify({

        "client_id":config.auth.auth0_client_id,
        "client_secret":config.auth.auth0_client_secret,
        "audience": config.auth.auth0_audience,
        "grant_type":"client_credentials", 
        "scope" : "openid"
    });
    
    
    var options = {
      hostname: config.auth.auth0_domain,
      port: 443,
      path: '/oauth/token',
      method: 'POST',
      headers: {
           'Content-Type': 'application/json'
         }
    };
    
    var request = https.request(options, (response) => {
      response.on('data', function(data) {
          res.json(JSON.parse(data));
      });

    });
    
    request.on('error', (e) => {
        config.handleUniversalError(e, res);
    });
    
    request.write(postData);
    request.end();
    
}

function checkLogin(req, res){

    var userId = req.body.userId;
    var password = req.body.password;

    if (!password || !userId){
        return res.status(403).send({ auth: false, message: 'Please provide both user-ID and password.' });
    }

    models.tblusers.findAll({
        where: {
            userId: userId
          }
    }).then(function(users) {
        if (users && users.length > 0) {			
        
            if(bcrypt.compareSync(password, users[0].password)) {
                // Passwords match

                let data = {
                    userId : users[0].userId, 
                    userName : users[0].userName, 
                    userBirthDate : users[0].userBirthDate, 
                    userAvatarPath : users[0].userAvatarPath
                }; 

                var token = jwt.sign(data, config.auth.jwtSecret, {
                    expiresIn: config.auth.expiresIn // expires in 90 secs
                });

                data.token = token;

                res.json(data);
            } else {
                // Passwords don't match
                throw new Error("Passwords dont match");
            }
               
        } else {
            throw new Error("No user could be found");
        }
    }).catch(error => {
        global.config.logger.error(error.stack);
        res.send(403, "Either username or password invalid");
      })

}

function getRandomInt(max) {
    return (Math.floor(Math.random() * Math.floor(max))).toString();
  }

function registerUser ( req, res ){

    let user = req.body.user;
    let context = req.body.context
    let secret = req.body.auth0_secret;

    if (secret == config.auth.auth0_secret){

        let newId = crypto.createHash('md5').update(user.email).digest("hex");

        models.tblusers.build({
            userId: newId,
            userName : user.nickname || user.email.substring(0,user.email.indexOf("@")), 
            userAvatarPath : user.picture_large,
            userCreatedAt : new Date()
        }).save()
          .then(resultUser => {

            let resp = {
                "cf_id" : resultUser.userId
            };

            res.json(resp);

          })
          .catch(error => {    
            if (error.original.errno == 1062){
                res.send(500, "Your user-ID has already been used");
            }else{
                res.send(500, error.name);
            }
          })
    }else{
        res.send(401, "Unauthorized");
    }
}

module.exports = { checkLogin, registerUser, getFacebookServerToken, validateFacebookClientToken, getAuth0AccessToken };