var models  = require('../models');
var messageCtrl = require('../controllers/message.controller');

function upsertVote(req, res){

    let sessionId = req.params.sessionId;
    let userId = req.auth.userId; 

    const vote = models.tblvotes.upsert({
        voteType: req.body.voteType,
        sessionId: sessionId,
        userId: userId
    }).then(vote => {

        console.log("vote saved"); 
        res.json(vote);

        (async () => {
            await messageCtrl.notifyVote(sessionId, userId);
        })();

        return null;
        
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
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
            
        res.send("comment not found");
    });
}

module.exports =   { upsertVote, deleteVote };