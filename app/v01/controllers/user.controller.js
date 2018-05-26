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
            config.logger.error(error);
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
        config.logger.error(error);
        res.send(500, error);
    })

}

function toggleFollower (req, res){

    let followerId = req.auth.userId;
    let followedId = req.params.userId; 

    if (followerId == followedId){
        res.send(500, {"message" : "You cannot follow yourself"});
        return;
    }
    
    (async () => {
        
        let followerPairExist = await getFollowerPairExist(followerId, followedId);

        if (followerPairExist){
            //delete pair
            removeFollowerPair(followerId, followedId).then(result => {
                res.json(true)
            }).catch(err => {
                config.logger.error(err);
                res.send(500, err);
            });
        }else{
            
            addFollowerPair(followerId, followedId).then(result => {
                res.json(true)
            }).catch(err => {
                config.logger.error(err);
                res.send(500, err);
            });
            
        }

    })();

}


async function getFollowerPairExist (followerId, followedId) {
    
    return new Promise(
        (resolve, reject) => {

            models.tblfollowers.findAll({
                where : {
                    "followerId" : followerId,
                    "followedId" : followedId,
                  }
            }).then(function(followerPair) {

                if (followerPair && followerPair.length > 0) {				
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(error => {
                config.logger.error(error);
            });

        }
    );
    
}

async function addFollowerPair (followerId, followedId) {
    
    return new Promise(
        (resolve, reject) => {

            const followerPair = models.tblfollowers.upsert({
                followerId: followerId, 
                followedId : followedId
            }).then(followerPair => {
                resolve(true);
            })
            .catch(error => {
                config.logger.error(error);
                reject(error);
            })

        }
    );
    
}

async function removeFollowerPair (followerId, followedId) {
    
    return new Promise(
        (resolve, reject) => {

            models.tblfollowers.destroy({
                where: {
                    followerId: followerId, 
                    followedId : followedId
                  }
            }).then(function(result) {
                resolve(true);
            }).catch(error => {
                config.logger.error(error);
                reject(error);
            })

        }
    );
    
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

            }).catch(error => {
                config.logger.error(error);
            })
        }
    );
    
}


async function getUserStats (userId) {
    
    return new Promise(
        (resolve, reject) => {


            var qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT count(*) as followerCnt FROM \
            cfdata.tblfollowers as f\
            where f.followedId = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(userStats => {

                resolve(userStats[0]);
                

            }).catch(error => {
                config.logger.error(error);
            })
        }
    );
    
}

function getUserProfileBase (req,res) {

    let requestUserId = req.auth.userId;
    let userId = req.params.userId;    
    
    (async () => {
        
        let userInfo = await getUserInfo(userId);
        let userStats = await getUserStats(userId);
        let followerPairExist = await getFollowerPairExist(requestUserId, userId)

        if (userInfo && userInfo.length > 0){

            let targetUserInfo = userInfo[0];
            
            targetUserInfo["followerCnt"] = userStats.followerCnt;
            
            if (followerPairExist){
                targetUserInfo["isFollowed"] = true
            }else{
                targetUserInfo["isFollowed"] = false
            }

            res.json(targetUserInfo)
        }else{
            res.json([])
        }
        

    })();


}




module.exports = { searchUser, listGroups, upsertProfileAvatar, getUserInfo, getUserProfileBase, toggleFollower};