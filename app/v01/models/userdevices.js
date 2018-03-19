
'use strict';
module.exports = (sequelize, DataTypes) => {
    var userdevices = sequelize.define('tbluserdevices', {
        userId: {
            type: DataTypes.TEXT,
            allowNull: false
        }, 
        deviceToken : {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true
        },
        lastUpdate: {
            type: DataTypes.DATE,
            allowNull: true
        }, 
    }, {
        timestamps : false
    });

  return userdevices;
};

