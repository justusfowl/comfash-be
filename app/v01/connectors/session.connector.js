var models  = require('../models');

async function getSessionInfo (sessionId) {
    
    return new Promise(
        (resolve, reject) => {

            var qryOption = { raw: true, replacements: [sessionId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT s.*, c.userId, c.collectionCreated, c.collectionTitle FROM cfdata.tblsessions as s \
            inner join cfdata.tblcollections as c on s.collectionId = c.collectionId \
            where s.sessionId = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(sessionInfo => {

                resolve(sessionInfo);

            })
        }
    );
    
}





module.exports =   { getSessionInfo };
