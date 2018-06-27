var Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

var logger = require('../../logger');

var versiony = require('versiony');

let env = (process.env.NODE_ENV).toLowerCase() || 'development'; 

var port;

if (env == 'development'){
  port = process.env.PORT || 9999;

  versiony
    .patch()                // will cause the minor version to be bumped by 1
    .from('version.json')   // read the version from version.json
    .to()                   // write the version to the source file (package.json)
                            // with the minor part bumped by 1
    .to('bower.json')       // apply the same version
    .to('package.json')     // apply the same version
    .end()                  // display info on the stdout about modified files

}
else if (env == 'production'){
  port = process.env.PORT || 443;
}else{
  port = 9999;
}


const config = {
    logger : logger.logger,
    sqlLogger : logger.sqlLogger,
    morganMiddleWare : logger.morganMiddleWare,
    env: env,
    port: port,
    APIVersion: '01',

    mysql: {
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS || "",
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
      logging: logger.sqlLogger.info.bind(logger.sqlLogger)
    },

    mongodb: {
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASS,
      database: process.env.MONGO_DB,
      host: process.env.MONGO_HOST, 
      port : process.env.MONGO_PORT 
    },

    solr: {
      server: process.env.SOLR_SERVER,
      port: process.env.SOLR_PORT,
      core: process.env.SOLR_CORE
    },

    signal : {
      restKey: process.env.SIGNAL_REST_KEY, 
      userAuthKey : process.env.SIGNAL_AUTH_KEY,
      appId : process.env.SIGNAL_APP_ID
    }, 

    auth : {
      jwtSecret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      auth0_secret : process.env.AUTH0_SECRET, 
      auth0_client_id: process.env.AUTH0_CLIENT_ID, 
      auth0_client_secret: process.env.AUTH0_CLIENT_SECRET, 
      auth0_audience : process.env.AUTH0_AUDIENCE, 
      auth0_domain: process.env.AUTH0_DOMAIN, 
      jwksUri : process.env.JWKS_URI,
      iss : process.env.ISS, 
      api_secret : process.env.API_SECRET
    }, 
    facebook : {
      "app_id" : process.env.FB_APP_ID, 
      "app_secret" : process.env.FB_APP_SECRET, 
    }, 
    linkPreview : {
      "api_key" : process.env.LINK_PREVIEW_KEY
    }, 
    mq : {
      mqServer: process.env.MQ_SERVER,
      mqUser: process.env.MQ_USER,
      mqPassword: process.env.MQ_PASSWORD,
      mqPort: process.env.MQ_Port,

    }
  };
  
  module.exports = config;
