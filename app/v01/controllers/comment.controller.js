var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
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
    });
}

module.exports =   { create, deleteItem };