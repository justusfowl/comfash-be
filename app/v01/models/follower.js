
'use strict';
module.exports = (sequelize, DataTypes) => {
  var follow = sequelize.define('tblfollowers', {
    followerId: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    followedId: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps : false
});
  return follow;
};

