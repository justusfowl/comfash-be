
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
    groupId: {
        type: DataTypes.INTEGER,
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

  return collection;
};

