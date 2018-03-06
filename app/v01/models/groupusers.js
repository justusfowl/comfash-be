
'use strict';
module.exports = (sequelize, DataTypes) => {
    var groupUsers = sequelize.define('tblgroupusers', {
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps : false
    });

  return groupUsers;
};

