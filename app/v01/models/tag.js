
'use strict';
module.exports = (sequelize, DataTypes) => {
    var purchaseTag = sequelize.define('tbltags', {
        tagId: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true
        },
        sessionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        tagUrl : {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tagTitle : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tagImage : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tagSeller : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tagBrand : {
            type: DataTypes.TEXT,
            allowNull: true,
        }, 
        xRatio : {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        yRatio : {
            type: DataTypes.FLOAT,
            allowNull: true,
        }
    }, {
        timestamps : false
    });

  return purchaseTag;
};
