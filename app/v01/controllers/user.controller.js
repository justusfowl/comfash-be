var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

function searchUser (req,res) {

    let searchStr = req.query.userSearch; 

    if (searchStr.length < 3){
        return res.status(500).send({ message: 'Not enough characters provided, at least 3.' });
    }

    models.tblusers.findAll({
        where : {
            [Op.or]: [
              {
                userId: {
                  [Op.like]: '%' + searchStr + '%'
                }
              },
              {
                userName: {
                  [Op.like]: '%' + searchStr + '%'
                }
              }
            ]
          },
        attributes: ['userId', 'userName', 'userAvatarPath']
    }).then(function(users) {
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


module.exports = { searchUser, listGroups};