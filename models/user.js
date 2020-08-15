"use strict";
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      secretKey: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return () => this.getDataValue("password");
        },
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return () => this.getDataValue("salt");
        },
      },
    },
    {
      beforeFind: (data, option) => {
        if (data.where.password) {
          data.where.password = User.encryptPassword(
            data.where.password,
            this.salt()
          );
        }
      },
    }
  );

  User.generateSalt = function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  };
  User.encryptPassword = function (plainText, salt) {
    return crypto
      .createHmac("sha512", salt)
      .update(plainText)
      .update(salt)
      .digest("hex");
  };
  const setSaltAndPassword = (user) => {
    if (user.changed("password")) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password(), user.salt());
    }
  };
  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  User.associate = function (models) {
    this.hasMany(models.Room, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
  };
  return User;
};
