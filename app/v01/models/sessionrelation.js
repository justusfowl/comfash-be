
'use strict';
module.exports = (sequelize, DataTypes) => {
    var sessionrelation = sequelize.define('tblsessionrelations', {
        userId : {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true, 
        },
        targetCollectionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
        }, 
        sourceSessionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    }, {
        timestamps : false
    });

  return sessionrelation;
};
