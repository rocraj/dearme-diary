const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  f_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  l_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ModifiedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  subscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'f',
  },
  penname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
  if (user.password) {
    const saltRounds = 10; // Number of salt rounds
    user.password = await bcrypt.hash(user.password, saltRounds); // Hash the password
  }
});

// Hash the password before updating the user (if the password is changed)
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const saltRounds = 10; // Number of salt rounds
    user.password = await bcrypt.hash(user.password, saltRounds); // Hash the password
  }
});

// Method to compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;