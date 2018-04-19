
'use strict';
module.exports = (sequelize, DataTypes) => {
  var collection = sequelize.define('tblcollections', {
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    userId: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    collectionCreated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    collectionTitle: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    collectionDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    privacyStatus: {
        type: DataTypes.INTEGER,
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

  return collection;
};

