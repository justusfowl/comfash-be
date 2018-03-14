
'use strict';
module.exports = (sequelize, DataTypes) => {
  var vote = sequelize.define('tblvotes', {
    voteChanged: {
        type: DataTypes.DATE,
        allowNull: true
    }, 
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    voteType: {
        type: DataTypes.INTEGER,
        allowNull: true
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

  return vote;
};

