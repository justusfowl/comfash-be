
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
        allowNull: true
    },
    xRatio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },    
    yRatio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prcSessionItem: {
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

  return comment;
};

