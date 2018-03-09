
'use strict';
module.exports = (sequelize, DataTypes) => {
    var groupUsers = sequelize.define('tblgroupusers', {
        collectionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }, 
        userIdIsAuthor : {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps : false
    });

  return groupUsers;
};

