function getLimitOffsetForQryStr(req){

    let query = req.query; 

    let top = query.top || null; 
    let skip = query.skip || 0;
    
    let str = ""; 

    if (top != null){
        str += "LIMIT " + top + " OFFSET " + skip;
    }

    return str;

}


  
module.exports = {
    
    getLimitOffsetForQryStr

};