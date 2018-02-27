/*

var sequelize = require('../../config/db');
var DataTypes = require('sequelize');
var crypto = require('crypto');


const User = sequelize.define('tblusers', {
    userId: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    salt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userBirthDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'tblusers',
    timestamps: false
});

  
User.prototype.retrieveAll = function(onSuccess, onError) {

    console.log(User); 

    User.findAll({}, {raw: true})
        .success(onSuccess).error(onError);	
};

    retrieveById: function(user_id, onSuccess, onError) {
      User.find({where: {id: user_id}}, {raw: true})
          .success(onSuccess).error(onError);	
    },
    add: function(onSuccess, onError) {
      var username = this.username;
      var password = this.password;
      
      var shasum = crypto.createHash('sha1');
      shasum.update(password);
      password = shasum.digest('hex');
      
      User.build({ username: username, password: password })
          .save().success(onSuccess).error(onError);
     },
    updateById: function(user_id, onSuccess, onError) {
      var id = user_id;
      var username = this.username;
      var password = this.password;
      
      var shasum = crypto.createHash('sha1');
      shasum.update(password);
      password = shasum.digest('hex');
                  
      User.update({ username: username,password: password},{where: {id: id} })
          .success(onSuccess).error(onError);
     },
    removeById: function(user_id, onSuccess, onError) {
      User.destroy({where: {id: user_id}}).success(onSuccess).error(onError);	
    }
  }
}

*/



'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('tblusers', {
    userId: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    userName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    salt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userBirthDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps : false
});

/*
  User.associate = function(models) {
    models.User.hasMany(models.Task);
  };
*/

  return User;
};

