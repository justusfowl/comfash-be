var models  = require('../models');

function list (req,res) {

    models.tblusers.findAll({}).then(function(users) {
        if (users) {				
            res.json(users);
        } else {
            res.send(401, "User not found");
        }
        }, function(error) {
            
        res.send("User not found");
    });
}

function create(req, res){

    const user = models.tblusers.build({
        userName: req.body.userName,
        userId : req.body.userId, 
        password: req.body.password, // here change to hash + salt
        salt: "noch kein salt vergeben", 
        userBirthDate: new Date()
      }).save()
      .then(anotherTask => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 
        res.json(user);
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
      })

}

module.exports =   { list, create };