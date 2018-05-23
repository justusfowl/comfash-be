var models  = require('../models');
var messageCtrl = require('../controllers/message.controller');
const config = require('../../config/config');

function upsertVote(req, res){

    let sessionId = req.params.sessionId;
    let userId = req.auth.userId; 

    const vote = models.tblvotes.upsert({
        voteType: req.body.voteType,
        sessionId: sessionId,
        userId: userId
    }).then(vote => {

        console.log("vote saved");

        (async () => {
            // send notification to owner of the session

            let voteStats = await getVoteStats(sessionId);
             
            res.json(voteStats);

            await messageCtrl.notifyVote(sessionId, userId);

        })();

        return null;
        
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error);
        config.logger.error(error);
        res.send(500, error);
      })

}

function deleteVote(req, res){

    models.tblvotes.destroy({
        where: {
            sessionId: req.params.sessionId,
            userId: req.auth.userId
          }
    }).then(function(vote) {
        if (vote) {				
            res.json(vote);
        } else {
            res.send(404, "comment not found");
        }
        }, function(error) {
            config.logger.error(error);
            res.send("comment not found");
    });
}

async function getVoteStats (sessionId) {
    
    return new Promise(
        (resolve, reject) => {

            var qryOption = { raw: true, replacements: [sessionId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT avg(v.voteType)as voteAvg, sessionId  FROM cfdata.tblvotes as v \
            where v.sessionId = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(voteStats => {

                if (voteStats.length > 0 && voteStats){
                   
                    resolve(voteStats[0]);
                }else{
                    resolve(null);
                }

            }).catch(error => {
                config.logger.error(error);
            })
        }
    );
    
}

module.exports =   { upsertVote, deleteVote };