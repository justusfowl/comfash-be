var models  = require('../models');

var _ = require('lodash');

var qryStrings= {

    // itemType classifies the item / source of the trending item (e.g. 1 = vote, 2 = comment)
    "trendingVotes" : '\
    Select \
        vo.*,  \
        itemCreator.userName as itemCreator,  \
        itemCreator.userAvatarPath as itemCreatorAvatarPath,  \
        s.sessionItemPath,  \
        s.sessionThumbnailPath, \
        c.collectionTitle,  \
        c.collectionId,  \
        colOwner.userName as colOwner,  \
        colOwner.userId as colOwnerId,  \
        comStats.commentCtn,  \
        voteStats.votesCtn,   \
        voteStats.votesAvg, \
        vo.voteChanged as refDate, \
        myVote.voteType as myVoteType, \
        1 as itemType  \
    FROM cfdata.tblvotes as vo \
    LEFT JOIN tblsessions s on vo.sessionId = s.sessionId  \
    LEFT JOIN tblcollections c on s.collectionId = c.collectionId  \
    LEFT JOIN cfdata.tblusers as colOwner on vo.userId = colOwner.userId \
    LEFT JOIN cfdata.tblusers as itemCreator on vo.userId = itemCreator.userId \
    LEFT JOIN ( \
        SELECT * FROM \
        cfdata.tblvotes  \
        WHERE userID = ? ) as myVote on vo.sessionId = myVote.sessionId \
    LEFT JOIN ( \
        select count(*) as commentCtn, sessionId  \
        from cfdata.tblcomments  \
        group by sessionId \
        ) as comStats on vo.sessionId = comStats.sessionId  \
    LEFT JOIN ( \
        select  \
            count(*) as votesCtn, \
            avg(voteType) as votesAvg, \
            sessionId  \
        from cfdata.tblvotes  \
        group by sessionId \
        ) as voteStats on vo.sessionId = voteStats.sessionId  \
    order by voteChanged DESC \
    LIMIT ? OFFSET ?; ', 


    "trendingComments" : '\
    Select \
        co.*,  \
        itemCreator.userName as itemCreator,  \
        itemCreator.userAvatarPath as itemCreatorAvatarPath,  \
        s.sessionItemPath,  \
        s.sessionThumbnailPath, \
        c.collectionTitle,  \
        c.collectionId,  \
        colOwner.userName as colOwner,  \
        colOwner.userId as colOwnerId,  \
        comStats.commentCtn,  \
        voteStats.votesCtn,   \
        voteStats.votesAvg,  \
        co.commentCreated as refDate, \
        myVote.voteType as myVoteType, \
        2 as itemType  \
    FROM cfdata.tblcomments as co \
    LEFT JOIN tblsessions s on co.sessionId = s.sessionId  \
    LEFT JOIN tblcollections c on s.collectionId = c.collectionId  \
    LEFT JOIN cfdata.tblusers as colOwner on co.userId = colOwner.userId \
    LEFT JOIN cfdata.tblusers as itemCreator on co.userId = itemCreator.userId \
    LEFT JOIN ( \
        SELECT * FROM \
        cfdata.tblvotes  \
        WHERE userID = ? ) as myVote on co.sessionId = myVote.sessionId \
    LEFT JOIN ( \
        select count(*) as commentCtn, sessionId  \
        from cfdata.tblcomments  \
        group by sessionId \
        ) as comStats on co.sessionId = comStats.sessionId  \
    LEFT JOIN ( \
        select  \
            count(*) as votesCtn, \
            avg(voteType) as votesAvg, \
            sessionId  \
        from cfdata.tblvotes  \
        group by sessionId \
        ) as voteStats on co.sessionId = voteStats.sessionId  \
    order by commentCreated DESC \
    LIMIT ? OFFSET ?; ', 



}

function getStream (req,res) {
    
    let limit = parseInt(req.query.limit) || 10; 
    let skip = parseInt(req.query.skip) || 0;

    let options = {
        userId : req.auth.userId,
        limit: limit, 
        skip : skip
    }; 

    (async () => {
        
        let trendComments = await getTrendingItems(options, "trendingComments");
        let trendVotes = await getTrendingItems(options, "trendingVotes");

        let output = trendComments.concat(trendVotes);

        let sortedOutput = _.orderBy(output, 'refDate', 'desc');

        res.json(sortedOutput)

    })();


}



async function getTrendingItems (options, target) {
    
    return new Promise(
        (resolve, reject) => {

            let userId = options.userId; 
            let limit = options.limit;
            let skip = options.skip;

            /*
            let limit = parseInt(req.query.limit) || 10; 
            let skip = parseInt(req.query.skip) || 0;
            */
            var qryOption = { raw: true, replacements: [userId, limit, skip], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr; 

            switch(target) {
                case "trendingVotes":
                    qryStr = qryStrings["trendingVotes"];
                    break;
                case "trendingComments":
                    qryStr = qryStrings["trendingComments"]
                    break;
                default:
                    qryStr = "";
            }
        
            models.sequelize.query(
                qryStr,
                qryOption
            ).then(trendComments => {

                resolve(trendComments);

            }).catch(err => {
                reject(err);
            })
        }
    );
    
}


module.exports =   { getStream };