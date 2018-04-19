
'use strict';
module.exports = (sequelize, DataTypes) => {
    var comparehist = sequelize.define('tblcomparehists', {
        userId: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true
        },
        sessionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }, 
        addedAt : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        modifiedAt : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        flagActive : {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps : false
    });

  return comparehist;
};
