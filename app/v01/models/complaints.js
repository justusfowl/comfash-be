
'use strict';
module.exports = (sequelize, DataTypes) => {
  var complaint = sequelize.define('tblcomplaints', {
    objectId: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    complaintCreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },  
    complaintStatus: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    objectType: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps : false
});
    
  return complaint;
};

