"use strict";
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
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
    },
    salt: {
      type: DataTypes.STRING,
    },
  });

  User.generateSalt = function () {
    return crypto.randomBytes(16).toString("base64");
  };
  User.encryptPassword = function (plainText, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  };

  User.beforeCreate((user) => {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  });

  User.updatePassword = async (email, newPassword) => {
    let user = await User.findOne({ attributes: ["salt"], where: { email } });
    if (user !== null) {
      const { salt } = user;
      const encryptedPassword = User.encryptPassword(newPassword, salt);
      const [isUpdated] = await User.update(
        { password: encryptedPassword, secretKey: null },
        { where: { email } }
      );
      return isUpdated;
    }

    return false;
  };

  User.findOneByEmailAndPassword = async (email, password) => {
    let user = await User.findOne({ attributes: ["salt"], where: { email } });
    if (user !== null) {
      const { salt } = user;
      const encryptedPassword = User.encryptPassword(password, salt);
      user = await User.findOne({
        where: { email, password: encryptedPassword },
      });
    }
    return user;
  };

  User.generateSecretkey = async (email) => {
    const secretKeySalt = Math.round(new Date().valueOf() * Math.random()) + "";
    const secretKey = User.encryptPassword(email, secretKeySalt);
    return secretKey.slice(0, 10);
  };

  User.associate = function (models) {
    this.hasMany(models.Room, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
  };

  return User;
};
