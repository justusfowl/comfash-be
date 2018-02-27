
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
    collectionId: {
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

  return session;
};

