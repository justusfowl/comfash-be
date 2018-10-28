var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var _ = require("lodash");
var messageCtrl = require('../controllers/message.controller');
var collectionConnector = require('../connectors/collection.connector');
var config = require("../../config/config");

function getWhereInQryString(reqGroupUsers, isInFlag){

    let whereStr = "";
    let isIn = " in";

    if (!isInFlag){
        isIn = " not in"
    }

    if (reqGroupUsers.length > 0){
        whereStr += " and userId "+ isIn +" (";

        for (var i = 0; i<reqGroupUsers.length; i++){

            whereStr += "'" + reqGroupUsers[i].userId + "'";
            
            if (i < (reqGroupUsers.length -1)){
                whereStr += ","
            }
        }

        whereStr += ")"
    }

    return whereStr;

}

async function getDeltaGroupUsers (collectionId, reqGroupUsers) {
    
    return new Promise(
        (resolve, reject) => {

            var qryOption = { raw: true, replacements: [collectionId], type: models.sequelize.QueryTypes.SELECT}; 

            let whereStr = getWhereInQryString(reqGroupUsers, true);
            
            let qryStr = 'SELECT * FROM cfdata.tblgroupusers  \
            where collectionId = ? ' + whereStr + ' ;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(deltaGroupUsers => {

                resolve(deltaGroupUsers);

            }).catch(error => {
                config.logger.error(error);
            })
        }
    );
    
}

async function deleteNegDeltaGroupUsers (collectionId, reqGroupUsers) {
    
    return new Promise(
        (resolve, reject) => {

            let qryArray= [];

            _(reqGroupUsers).forEach(function (groupUser){

                qryArray.push(groupUser.userId)

            });
            
            models.tblgroupusers.destroy({
                where: {
                    "collectionId" : collectionId,
                    "userId" : {[Op.notIn]:qryArray}, 
                    "userIdIsAuthor" : {[Op.ne]:1}
                  }
            }).then(deltaGroupUsers => {

                resolve(deltaGroupUsers);

            }).catch(error => {
                config.logger.error(error);
            })
        }
    );
    
}

function compareGroupUsers(reqGroupUsers, existingGroupUsers){

    let newUsers = []; 

    _(reqGroupUsers).forEach(function (reqUser){

        let groupUserExists = false;

        _(existingGroupUsers).forEach(function (existUser){

            if (reqUser.userId == existUser.userId){
                groupUserExists = true;
            }

        });

        if (!groupUserExists){
            newUsers.push(reqUser)
        }

    });

    let response = {
        "newUsers" : newUsers
    };

    return response;

}



async function bulkInsertGroupUsers (ownerUserId, collectionId, addUsersSharedWith, flagAddAuthor=false) {
    
    return new Promise(
        (resolve, reject) => {

                var groupUsers = [];

                if (addUsersSharedWith){
            
                    for (var i = 0; i<addUsersSharedWith.length; i++){
                
                        let sharedUserId = addUsersSharedWith[i].userId; 
                
                        let user = {
                            "collectionId" : collectionId, 
                            "userId" : sharedUserId, 
                            "userIdIsAuthor" : 0
                        }

                        groupUsers.push(user);

                    }

                    if (flagAddAuthor){
                        groupUsers.push({
                            "collectionId" : collectionId, 
                            "userId" : ownerUserId, 
                            "userIdIsAuthor" : 1
                        })
                    }
                    
                    models.tblgroupusers.bulkCreate(groupUsers)
                    .then(function(response){

                        resolve(groupUsers);
                    
                    })
                    .catch(function(error){
                        config.handleUniversalError(error, res);
                    })
            }else{
                reject(groupUsers)
            }
        }
    );
    
}




async function deltaLoadGroupUsers(collectionId, authorId, usersSharedWith){

    let deltaGroupUsers = await getDeltaGroupUsers(collectionId, usersSharedWith);
    let deleteNegDeltaGroupUsersResponse = await deleteNegDeltaGroupUsers(collectionId, usersSharedWith);

    let additionalUsers = compareGroupUsers(usersSharedWith, deltaGroupUsers);

    let addUsersSharedWith = additionalUsers.newUsers;

    let addedGroupUsers = await bulkInsertGroupUsers(authorId, collectionId, addUsersSharedWith, false);
    
    return addedGroupUsers;
}




module.exports =   { deltaLoadGroupUsers, bulkInsertGroupUsers  };