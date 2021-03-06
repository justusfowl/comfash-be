var models  = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var config = require("../../config/config");

function create(req, res){

    let userId = req.auth.userId; 
    let objectId = req.body.objectId; 
    let objectType = req.body.objectType;

    const complaint = models.tblcomplaints.build({
        userId : userId,
        objectType : objectType, 
        objectId : objectId,
        complaintStatus : 1
    }).save()
      .then(anotherTask => {
        res.json({"message" : "complaint received"});
      })
      .catch(error => {
        config.handleUniversalError(error, res);
      })

}


module.exports =   { create };