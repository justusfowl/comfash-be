var Sequelize = require('sequelize');
const config = require('./config');

var dbOptions = {
    connectionLimit : 10,
    host: config.mysqlDb.host,
    port: config.mysqlDb.port,
    database: config.mysqlDb.database
};

if (config.mysqlDb.user != ""){
    dbOptions["user"] = config.mysqlDb.user; 
    dbOptions["password"] = config.mysqlDb.password; 
}


var sequelize = new Sequelize(config.mysqlDb.database, null, null, {
    host: config.mysqlDb.host,
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
    // SQLite only
    //storage: 'path/to/database.sqlite',
  
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  });

module.exports = sequelize