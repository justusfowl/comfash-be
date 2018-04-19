
'use strict';
module.exports = (sequelize, DataTypes) => {
  var session = sequelize.define('tblsessions', {
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    sessionCreated: {
        type: DataTypes.DATE,
        allowNull: false, 
        defaultValue: DataTypes.NOW
    },
    sessionItemPath: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sessionItemType: {
        type: DataTypes.TEXT,
        allowNull: false
    },  
    sessionThumbnailPath: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    primeColor: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps : false
});

/*
  User.associate = function(models) {
    models.User.hasMany(models.Task);
  };
*/

  return session;
};

