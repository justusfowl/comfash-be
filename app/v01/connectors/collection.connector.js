var models  = require('../models');

async function getCollectionInfo (collectionId) {
    
    return new Promise(
        (resolve, reject) => {

            var qryOption = { raw: true, replacements: [collectionId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr = 'SELECT c.* FROM cfdata.tblcollections as c \
            where c.collectionId = ?;';
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(collectionInfo => {

                resolve(collectionInfo);

            })
        }
    );
    
}

module.exports =   { getCollectionInfo };