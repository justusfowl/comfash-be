
'use strict';
module.exports = (sequelize, DataTypes) => {
  var comment = sequelize.define('tblcomments', {
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    commentText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    commentCreated: {
        type: DataTypes.DATE,
        allowNull: false
    },
    xRatio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },    
    yRatio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    imageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.TEXT,
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

  return comment;
};

