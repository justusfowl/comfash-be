var Joi = require('joi');


const validationObj = {

    collection: {
                  create : {
                            name : Joi.string().required(), 
                            authorId : Joi.string().required(), 
                            collectionCreated : Joi.date()
                          } 
                }, 
    comment: {
                  create : {
                            commentText : Joi.string().required(),
                            commentCreated : Joi.date().default(new Date()),
                            yRatio : Joi.number().required(),
                            xRatio : Joi.number().required()
                          } 
                },             
  };
  
  module.exports = validationObj;