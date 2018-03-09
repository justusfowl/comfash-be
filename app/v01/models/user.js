
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
        allowNull: true
    },
    userBirthDate: {
        type: DataTypes.DATE,
        allowNull: false
    }, 
    userAvatarPath: {
        type: DataTypes.TEXT,
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

