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

function listGroups (req,res) {

    let testGroups = [{"groupId" : 1},{"groupId" : 5}]
    res.json(testGroups);

}

function socketGroups (userId){

}


module.exports = { list, listGroups};