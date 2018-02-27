var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

function create(req, res){

    let imageId = req.params.imageId;

    const comment = models.tblcomments.build({
        commentText: req.body.commentText,
        xRatio: req.body.xRatio,
        yRatio: req.body.yRatio,
        imageId: imageId,
        userId: req.body.userId
    }).save()
      .then(anotherTask => {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log("after save"); 
        res.json(comment);
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