
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const config = require('../../config/config');

var models = require('../models');

const uuidv1 = require('uuid/v1');


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
        // Ooops, do some error-handling
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

        let newId = uuidv1() + getRandomInt(200);

        models.tblusers.build({
            userId: newId,
            userName : user.nickname || user.email.substring(0,user.email.indexOf("@")), 
            userAvatarPath : user.picture_large,
            userCreatedAt : new Date()
        }).save()
          .then(resultUser => {
            // you can now access the currently saved task with the variable anotherTask... nice!
            console.log("registering new user successful: ", resultUser.userId); 

            let resp = {
                "cf_id" : resultUser.userId
            };

            res.json(resp);

          })
          .catch(error => {
            // Ooops, do some error-handling
            console.log(error);
    
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

// function authorizeRead()


module.exports = { checkLogin, registerUser };