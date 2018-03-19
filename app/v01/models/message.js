
'use strict';
module.exports = (sequelize, DataTypes) => {
  var message = sequelize.define('tblmessages', {
    messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    messageBody: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    linkUrl: {
        type: DataTypes.TEXT,
        allowNull: false
    },  
    messageCreated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isUnread: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps : false
});

  return message;
};

