var _ = require('lodash');
var config = require ('./config');
let translateObj = {

    "VOTE_OWNER" : {
        "frontEndKey" : "HAS_VOTED",
        "notifyHeadings" : {
                "en" : "FittingStreamUpdate"
            },
        "notifyContent" : {
            "en" : "@{userName} has voted on #{collectionTitle}",
            "de" : "@{userName} hat #{collectionTitle} bewertet"
        },

    },
    "COLLECTION_INVITE" : {
        "frontEndKey" : "COL_HAS_INVITED",
        "notifyHeadings" : {
                "en" : "Unterstützung", 
                "de" : "Anfrage"
            },
        "notifyContent" : {
            "en" : "@{userName} has requested feedback on #{collectionTitle}",
            "de" : "@{userName} hat um Unterstützung für #{collectionTitle} gebeten"
        },

    },
    "SESSION_CREATE" : {
        "frontEndKey" : "SESSION_ADDED",
        "notifyHeadings" : {
                "en" : "Update"
            },
        "notifyContent" : {
            "en" : "@{userName} has added to #{collectionTitle}",
            "de" : "@{userName} fügt #{collectionTitle} eine Session zu"
        },

    },
    /**
     * Function to prepare the translation before emitting a message (both via push, socket or persistency)
     * @param: {options} : depicts a single-level object with key-value pairs for the replacement of strings in translations
     */
    prepareItem : function (options, targetKey){

        try {

            let target = this[targetKey];
            let content, headings; 
            try {
                headings = _.mapValues(target.notifyHeadings, function (value, key) { 

                    return value.replace(/{(\w+)}/g, function(_,k){
                        return options[k];
                });
        
                });
            }catch(err){
                headings = {err: "err"};
                config.logger.info("translation does not contain any headings for key: " + targetKey);
            }

            try {
                content = _.mapValues(target.notifyContent, function (value, key) { 

                    return value.replace(/{(\w+)}/g, function(_,k){
                        return options[k];
                });
        
                });
            }catch(err){
                content = {err: "err"};
                config.logger.info("translation does not contain any content for key: " + targetKey);
            }


            return {
                "frontEndKey" : target.frontEndKey,
                headings : headings, 
                content: content
            };
        
        }
        catch(err){
            config.logger.info("translation does not contain any content for key: " + targetKey);
        }       
    }
}

module.exports = translateObj;
