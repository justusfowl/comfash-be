var models  = require('../models');
var Sequelize = require("sequelize");
var base64ToImage = require('base64-to-image');
const uuidv1 = require('uuid/v1');

const Op = Sequelize.Op;

var cnt = 1;

function create(req, res){

    let sessionId = req.params.sessionId;

    var base64Str = req.body.imagePath;
    var path ='public/img/';

    const filename = uuidv1();

    //const filename = cnt.toString(); 
    cnt++;

    var optionalObj = {'fileName': filename, 'type':'jpeg'};
        
    //Note base64ToImage function returns imageInfo which is an object with imageType and fileName.
    var imageInfo = base64ToImage(base64Str,path,optionalObj); 

    const image = models.tblimages.build({
        imagePath: "http://cl18:9999/img/" + imageInfo.fileName,
        order: req.body.order,
        height: req.body.height,
        width: req.body.width,
        sessionId: sessionId
    }).save()
      .then(anotherTask => {
        console.log("after save"); 
        res.json(image);
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
      })

}


module.exports =   { create };