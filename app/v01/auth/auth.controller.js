
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const config = require('../../config/config');

var models = require('../models');

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

function registerUser ( req, res ){

    let password = req.body.password;
    let hashedPw = bcrypt.hashSync(password, 10);

    const comment = models.tblusers.build({
        userId: req.body.userId,
        userBirthDate: req.body.userBirthDate, 
        userName : req.body.username, 
        password : hashedPw
    }).save()
      .then(resultUser => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 
        res.json(resultUser);
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

}

// function authorizeRead()


module.exports = { checkLogin, registerUser };