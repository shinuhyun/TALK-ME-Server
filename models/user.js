'use strict';
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
        return () => this.getDataValue('password');
      },
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return () => this.getDataValue('salt');
      },
    },
  });

  User.generateSalt = function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  };
  User.encryptPassword = function (plainText, salt) {
    return crypto
      .createHmac('sha512', salt)
      .update(plainText)
      .update(salt)
      .digest('hex');
  };
  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password(), user.salt());
    }
  };
  User.beforeValidate(setSaltAndPassword);
  // User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  const convertToEncryptPassword = async (email, password) => {
    // email이 일치하는 record를 찾아 salt값 가져오기
    const { salt } = (await User.findOne({
      attributes: ['salt'],
      where: { email },
    })) || { salt: null };

    // email이 일치하는 record가 없을 경우
    if (salt === null) {
      return null;
    }

    // 가져온 salt값으로 암호화된 password 값 구하기
    const encryptedPassword = User.encryptPassword(password, salt());
    return encryptedPassword;
  };

  User.findOneByEmailAndPassword = async (email, password) => {
    try {
      const encryptPassword = await convertToEncryptPassword(email, password);
      if (encryptPassword === null) {
        return null;
      }
      // email과 암호화된 password 값이 일치하는 유저 찾기
      const result = await User.findOne({
        where: { email, password: encryptPassword },
      });
      return result;
    } catch (err) {
      throw Error(err);
    }
  };

  User.associate = function (models) {
    this.hasMany(models.Room, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };
  return User;
};
