var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const config = require('../../config/config');

var base64ToImage = require('base64-to-image');
const uuidv1 = require('uuid/v1');

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

function upsertProfileAvatar (req, res){

    let base64Str = req.body.imagePath;
    let userId = req.auth.userId; 

    let filename = uuidv1();

    // place pictures in folder a for avatars
    let path = config.publicDir  + '/a/';

    var optionalObj = {'fileName': filename, 'type':'jpeg'}; 
    
    var imageInfo = base64ToImage(base64Str,path,optionalObj); 

    const vote = models.tblusers.upsert({
        userId: req.auth.userId, 
        userAvatarPath : "/a/" + imageInfo.fileName
    }).then(user => {
        console.log("user avatar saved"); 
        res.json(user);
        })
    .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
    })

}


async function getUserInfo (userId) {
    
    return new Promise(
        (resolve, reject) => {


            var qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT u.userId, u.userName, u.userAvatarPath FROM \
            cfdata.tblusers as u\
            where u.userId = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(userInfo => {

                resolve(userInfo);

            })
        }
    );
    
}

function getUserProfileBase (req,res) {

    let userId = req.params.userId;
    
    (async () => {
        
        let userInfo = await getUserInfo(userId);

        if (userInfo && userInfo.length > 0){
            res.json(userInfo[0])
        }else{
            res.json([])
        }
        

    })();


}




module.exports = { searchUser, listGroups, upsertProfileAvatar, getUserInfo, getUserProfileBase};