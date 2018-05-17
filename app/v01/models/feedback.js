
'use strict';
module.exports = (sequelize, DataTypes) => {
    var feedback = sequelize.define('tblfeedbacks', {
        feedbackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true
        },
        userId: {
            type: DataTypes.TEXT,
            allowNull: false
        }, 
        feedbackText : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        screenshotPath : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        feedbackCreatedAt : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        feedbackStatus : {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        timestamps : false
    });

  return feedback;
};
