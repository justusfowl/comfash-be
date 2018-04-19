
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
    userBirthDate: {
        type: DataTypes.DATE,
        allowNull: true
    }, 
    userAvatarPath: {
        type: DataTypes.TEXT,
        allowNull: true
    }, 
    userCreatedAt : {
        type: DataTypes.DATE,
        allowNull: false
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

