var models  = require('../models');

var config = require("../../config/config");


function listCompareHist (req,res) {

    let userId = req.auth.userId; 


    var qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 
    
    let qryStr = 'SELECT * FROM cfdata.tblcomparehists as c  \
    LEFT JOIN tblsessions as s on c.sessionId = s.sessionId \
    where userId = ?  \
    ORDER BY modifiedAt DESC';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(compareHist => {

        console.log("comparehist saved"); 
        res.json(compareHist);

    }).catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
        config.logger.error(error);
      });

}

function upsertCompareHist(req, res){

    let sessionId = req.params.sessionId;
    let userId = req.auth.userId; 

    const comparehist = models.tblcomparehists.upsert({
        sessionId: sessionId,
        userId: userId, 
        modifiedAt : new Date(), 
        flagActive : 1
    }).then(comparehist => {

        console.log("comparehist saved"); 
        res.json(comparehist);
        
      }).catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
        config.logger.error(error);
      })

}

function deleteComparehist(req, res){

    models.tblcomparehists.update(
        {        
            flagActive : 0
        },
        {
        where: {
            sessionId: req.params.sessionId,
            userId: req.auth.userId
          }
    }).then(function(comparehist) {
        if (comparehist) {				
            res.json(comparehist);
        } else {
            res.send(404, "comparehist not found");
        }
        }, function(error) {
            
        res.send("comparehist not found");
    }).catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
        config.logger.error(error);
      })
}

module.exports =   { listCompareHist, upsertCompareHist, deleteComparehist };