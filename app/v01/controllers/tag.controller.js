var models  = require('../models');
var config = require('../../config/config'); 


function upsertTag(req, res){

    let sessionId = req.params.sessionId;
    let userId = req.auth.userId; 
    let tag = req.body.tag;

    const vote = models.tblvotes.upsert(tag).then(tag => {
        res.json(tag);
        
      })
      .catch(error => {
        config.handleUniversalError(error, res);
      })

}

async function createTags(sessionId, tags) {
    return new Promise(
        (resolve, reject) => {

            let purchaseTags = [];

            tags.forEach(tag => {

                let newTag = {
                    sessionId: sessionId,
                    tagUrl : tag.tagUrl,
                    tagTitle : tag.tagTitle,
                    tagImage : tag.tagImage,
                    tagSeller : tag.tagSeller,
                    tagBrand : tag.tagBrand, 
                    xRatio: tag.xRatio, 
                    yRatio: tag.yRatio
                }

                purchaseTags.push(newTag);
            });

            models.tbltags.bulkCreate(purchaseTags).then(response => {

                resolve(true);
                return null;
        
              })
              .catch(error => {
                config.logger.error(error);
                reject (false)
              })

        }
    
    );
};


function deleteTag(req, res){
    models.tblvotes.destroy({
        where: {
            tagId: req.params.tagId
          }
    }).then(function(tag) {
        if (tag) {				
            res.json(tag);
        } else {
            res.send(404, "tag not found");
        }
        }, function(error) {
            config.logger.error(error);
            res.send("tag not found");
    });
}

module.exports =   { upsertTag, createTags, deleteTag };