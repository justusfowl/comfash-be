var models  = require('../models');

async function getSessionRelationInfo (userId, sessionId) {
    
    return new Promise(
        (resolve, reject) => {

            var qryOption = { raw: true, replacements: [sessionId, userId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT rel.*, s.collectionId FROM cfdata.tblsessionrelations as rel  \
            INNER JOIN tblsessions as s on s.sessionId = rel.sourceSessionId  \
            where rel.sourceSessionId = ? and rel.userId = ? ;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(sessionRelationInfo => {

                resolve(sessionRelationInfo);

            })
        }
    );
    
}


module.exports =   { getSessionRelationInfo };
