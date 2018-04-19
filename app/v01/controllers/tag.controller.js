var models  = require('../models');


function upsertTag(req, res){

    let sessionId = req.params.sessionId;
    let userId = req.auth.userId; 
    let tag = req.body.tag;

    const vote = models.tblvotes.upsert(tag).then(tag => {

        console.log("tag saved"); 
        res.json(tag);
        
      })
      .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
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
                    xRatio: tag.coords.xRatio, 
                    yRatio: tag.coords.yRatio
                }

                purchaseTags.push(newTag);
            });

            models.tbltags.bulkCreate(purchaseTags).then(response => {

                resolve(true);
                return null;
        
              })
              .catch(error => {
                console.log(error);
                reject (false)
              })

        }
    
    );
};


function deleteTag(req, res){

    console.log("HIER NOCH CHECKEN OB REQ.auth.userId write access auf das tag hat")

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
            
        res.send("tag not found");
    });
}

module.exports =   { upsertTag, createTags, deleteTag };