var Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

var logger = require('../../logger');

let env = (process.env.NODE_ENV).toLowerCase() || 'development'; 

var port;

if (env == 'development'){
  port = process.env.PORT || 9999;
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
    auth : {
      jwtSecret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    },
    APIVersion: '01',
    mysql: {
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS || "",
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
      logging: logger.sqlLogger.info.bind(logger.sqlLogger)
    },

    signal : {
      restKey: process.env.SIGNAL_REST_KEY, 
      userAuthKey : process.env.SIGNAL_AUTH_KEY,
      appId : process.env.SIGNAL_APP_ID
    }, 

    auth : {
      auth0_secret : process.env.AUTH0_SECRET, 
      auth0_client_id: process.env.AUTH0_CLIENT_ID, 
      auth0_client_secret: process.env.AUTH0_CLIENT_SECRET, 
      auth0_audience : process.env.AUTH0_AUDIENCE, 
      auth0_domain: process.env.AUTH0_DOMAIN
    }, 
    facebook : {
      "app_id" : process.env.FB_APP_ID, 
      "app_secret" : process.env.FB_APP_SECRET, 
    }
  };
  
  module.exports = config;
