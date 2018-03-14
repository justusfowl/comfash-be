var models  = require('../models');



function getStream (req,res) {
    
    let limit = parseInt(req.query.limit) || 10; 
    let skip = parseInt(req.query.skip) || 0;

    var qryOption = { raw: true, replacements: [limit, skip, limit, skip], type: models.sequelize.QueryTypes.SELECT}; 

    let qryStr = '\
        SELECT \
            userName, \
            userAvatarPath,\
            collectionId, \
            collectionTitle, \
            collectionCreated,\
            max(voteChanged) as lastVoted, \
            max(commentCreated) as lastCommented, \
            max(sessionThumbnailPath) as sessionThumbnailPath,\
            avg(voteType) as avgVote, \
            count( distinct sessionId) as noSessions\
            from (\
                SELECT  \
                    c.collectionId, \
                    c.collectionTitle, \
                    c.collectionCreated,\
                    u.userName, \
                    u.userAvatarPath,\
                    s.sessionId,  \
                    s.sessionThumbnailPath,\
                    co.commentCreated,  \
                    v.voteType,  \
                    v.voteChanged  \
                FROM tblcollections c \
                LEFT JOIN tblsessions s on c.collectionId = s.collectionId \
                LEFT JOIN tblcomments co on s.sessionId = co.sessionId  \
                LEFT JOIN tblvotes v on s.sessionId = v.sessionId \
                LEFT JOIN cfdata.tblusers as u on c.userId = u.userId \
                \
                INNER JOIN ( \
                    \
                select * from ( \
                Select co.sessionId, co.commentCreated \
                from cfdata.tblcomments as co \
                order by co.commentCreated desc \
                LIMIT ? OFFSET ? \
                ) as a\
                union all \
                select * from (\
                select vo.sessionId, vo.voteChanged\
                from cfdata.tblvotes as vo\
                order by vo.voteChanged desc\
                limit ? OFFSET ? ) as b\
                )as updates on updates.sessionId = s.sessionId\
                ORDER BY c.collectionId, s.sessionId, co.commentId\
            ) as b\
            group by \
                userName, \
                collectionId, \
                collectionTitle\
            order by max(voteChanged) DESC, max(commentCreated) DESC; ';

    models.sequelize.query(
        qryStr,
        qryOption
    ).then(trendStream => {

        res.json(trendStream);
        console.log(trendStream)
    })
    .catch(error => {
        // Ooops, do some error-handling
        console.log(error); 
        res.send(500, error);
      })
}



module.exports =   { getStream };