var models  = require('../models');

var _ = require('lodash');


function getQryString(key, flagIsUserId = false){

    let whereUserId = "";

    if (flagIsUserId){
        whereUserId = " WHERE item.userId = ?"
    }

    var qryStrings= {

        // itemType classifies the item / source of the trending item (e.g. 1 = vote, 2 = comment)
        "trendingVotes" : '\
        Select \
        item.*,  \
            itemCreator.userName as itemCreator,  \
            itemCreator.userAvatarPath as itemCreatorAvatarPath,  \
            s.sessionItemPath,  \
            s.sessionThumbnailPath, \
            s.sessionCreated, \
            c.collectionTitle,  \
            s.primeColor, \
            c.collectionId,  \
            colOwner.userName as colOwner,  \
            colOwner.userId as colOwnerId,  \
            colOwner.userAvatarPath as colOwnerAvatarPath,  \
            comStats.commentCnt,  \
            voteStats.voteCnt,   \
            voteStats.voteAvg, \
            item.voteChanged as refDate, \
            myVote.voteType as myVoteType, \
            myVote.voteChanged as myVoteChanged, \
            1 as itemType  \
        FROM cfdata.tblvotes as item \
        LEFT JOIN tblsessions s on item.sessionId = s.sessionId  \
        LEFT JOIN tblcollections c on s.collectionId = c.collectionId  \
        LEFT JOIN cfdata.tblusers as colOwner on c.userId = colOwner.userId \
        LEFT JOIN cfdata.tblusers as itemCreator on item.userId = itemCreator.userId \
        LEFT JOIN ( \
            SELECT * FROM \
            cfdata.tblvotes  \
            WHERE userId = ? ) as myVote on item.sessionId = myVote.sessionId \
        LEFT JOIN ( \
            select count(*) as commentCnt, sessionId  \
            from cfdata.tblcomments  \
            group by sessionId \
            ) as comStats on item.sessionId = comStats.sessionId  \
        LEFT JOIN ( \
            select  \
                count(*) as voteCnt, \
                avg(voteType) as voteAvg, \
                sessionId  \
            from cfdata.tblvotes  \
            group by sessionId \
            ) as voteStats on item.sessionId = voteStats.sessionId ' + whereUserId + '\
        order by voteChanged DESC \
        LIMIT ? OFFSET ?; ', 


        "trendingComments" : '\
        Select \
        item.*,  \
            itemCreator.userName as itemCreator,  \
            itemCreator.userAvatarPath as itemCreatorAvatarPath,  \
            s.sessionItemPath,  \
            s.sessionThumbnailPath, \
            s.sessionCreated, \
            s.primeColor, \
            c.collectionTitle,  \
            c.collectionId,  \
            colOwner.userName as colOwner,  \
            colOwner.userId as colOwnerId,  \
            colOwner.userAvatarPath as colOwnerAvatarPath,  \
            comStats.commentCnt,  \
            voteStats.voteCnt,   \
            voteStats.voteAvg,  \
            item.commentCreated as refDate, \
            myVote.voteType as myVoteType, \
            myVote.voteChanged as myVoteChanged, \
            2 as itemType  \
        FROM cfdata.tblcomments as item \
        LEFT JOIN tblsessions s on item.sessionId = s.sessionId  \
        LEFT JOIN tblcollections c on s.collectionId = c.collectionId  \
        LEFT JOIN cfdata.tblusers as colOwner on c.userId = colOwner.userId \
        LEFT JOIN cfdata.tblusers as itemCreator on item.userId = itemCreator.userId \
        LEFT JOIN ( \
            SELECT * FROM \
            cfdata.tblvotes  \
            WHERE userID = ? ) as myVote on item.sessionId = myVote.sessionId \
        LEFT JOIN ( \
            select count(*) as commentCnt, sessionId  \
            from cfdata.tblcomments  \
            group by sessionId \
            ) as comStats on item.sessionId = comStats.sessionId  \
        LEFT JOIN ( \
            select  \
                count(*) as voteCnt, \
                avg(voteType) as voteAvg, \
                sessionId  \
            from cfdata.tblvotes  \
            group by sessionId \
            ) as voteStats on item.sessionId = voteStats.sessionId ' + whereUserId + '\
        order by commentCreated DESC \
        LIMIT ? OFFSET ?; ', 



    }

    return qryStrings[key];

}

function getStream (req,res) {
    
    let limit = parseInt(req.query.limit) || 10; 
    let skip = parseInt(req.query.skip) || 0;

    let flagUserActivity = req.query.flagIsUserId;

    let options = {
        userId : req.auth.userId,
        limit: limit, 
        skip : skip, 
        flagUserActivity : flagUserActivity
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
            var qryOption = { raw: true, replacements: [userId], type: models.sequelize.QueryTypes.SELECT}; 

            let qryStr;

            if (options.flagUserActivity){
                qryStr = getQryString(target, true);
                qryOption.replacements.push(userId);
            }else{
                qryStr = getQryString(target)
            }

            qryOption.replacements.push(limit);
            qryOption.replacements.push(skip)

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