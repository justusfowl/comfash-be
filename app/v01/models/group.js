
'use strict';
module.exports = (sequelize, DataTypes) => {
  var group = sequelize.define('tblgroups', {
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    groupTitle: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorId: {
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

  return group;
};

