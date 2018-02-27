
'use strict';
module.exports = (sequelize, DataTypes) => {
  var image = sequelize.define('tblimages', {
    imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    imagePath: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: false
    },    
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sessionId: {
        type: DataTypes.INTEGER,
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

  return image;
};

