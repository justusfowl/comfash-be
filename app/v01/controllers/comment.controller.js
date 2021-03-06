var models  = require('../models');
var Sequelize = require("sequelize");
var config = require("../../config/config");


function listCommentForSession (req,res) {

    let userId = req.auth.userId;
    let sessionId = req.params.sessionId;

    var qryOption = { raw: true, replacements: [sessionId], type: models.sequelize.QueryTypes.SELECT}; 
    
    let qryStr = 
    'SELECT c.* \
    ,u.userAvatarPath as commentUserAvatarPath, \
    u.userName as commentUserName, \
    u.userId as commentUserId \
    FROM cfdata.tblcomments as c  \
    LEFT JOIN tblusers as u on c.userId = u.userId \
    where c.sessionId = ?  \
    ORDER BY c.commentCreated DESC';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(compareHist => {

        console.log("comparehist saved"); 
        res.json(compareHist);

    }).catch(error => {
        config.handleUniversalError(error, res);
    })

}

function create(req, res){

    const comment = models.tblcomments.build({
        commentText: req.body.commentText,
        xRatio: req.body.xRatio,
        yRatio: req.body.yRatio,
        sessionId: req.body.sessionId,
        userId: req.auth.userId, 
        prcSessionItem : req.body.prcSessionItem
    }).save()
      .then(anotherTask => {
        console.log("after save"); 
        res.json(anotherTask);
      })
      .catch(error => {
        config.handleUniversalError(error, res);
      })

}

function deleteItem(req, res){

    models.tblcomments.destroy({
        where: {
            commentId: req.params.commentId
          }
    }).then(function(comment) {
        if (comment) {				
            res.json(comment);
        } else {
            res.send(401, "comment not found");
        }
        }, function(error) {
            
        res.send("comment not found");
    }).catch(error => {
        config.handleUniversalError(error, res);
      });
}

module.exports =   { listCommentForSession, create, deleteItem };